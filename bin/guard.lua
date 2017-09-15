#!/usr/bin/lua

-- This is script that runs periodically to validate
-- iptables (-t mangle) allowed_guests chain against
-- sessions table stored in database.

local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../vendor/?.lua;" .. dirname .. "/../backend/?.lua";

-- bootstrap application (to have database), but not run
require "application".bootstrap(dirname .. "/../backend");

local Session = require "models.session";
local Arp = require "models.arp";

io.stdout:write("Validating guest sessions.\n");

-- iterate through rules
local currentRules = io.popen("iptables -t mangle -xnvL allowed_guests");
for rule in currentRules:lines() do
    -- grab some basic metrics
    local outgoingPkts, outgoingBytes, macAddress = rule:match("%s*(%d+)%s+(%d+).-MAC%s+(%S+)");

    -- perform checks in pcall to catch errors
    local status, error = pcall(function(mac, pkts, bytes)
        if mac then
            io.stdout:write("Validatig " .. assert(mac) .. ".\n");
            local session = Session.byMac(mac);

            if session then
                -- check if session is still valid
                if not session.isValid then
                    -- session expired, delete
                    session:delete();
                    return 0;
                end

                local currentIp = Arp.findIpByMac(mac);


                -- if IP has been changed, then something is wrong and probably
                -- someone is spoofing MAC address to gain network access
                if (currentIp and currentIp ~= session.ip) then
                    -- ip conflict, delete session
                    io.stdout:write("IP address recorded in session does not match current. Deleting session.\n");
                    io.stdout:write("Current IP: " .. currentIp .. ", Recorder IP: " .. session.ip .. ".\n");
                    io.stdout:write("Current MAC: " .. mac .. ", Recorder MAC: " .. session.mac .. ".\n");
                    session:delete();
                    return 0;
                end

                -- if traffic was recorded for given session, extend it's validity
                -- for another day,
                if pkts > session.pkts then
                    io.stdout:write("Extending session lifetime for " .. session.mac .. " (" .. session.ip .. ").\n");
                    session:updateCounters(pkts, bytes);
                    session:extend();
                end
            else
                -- session does not exist, immediately delete rule!
                io.stdout:write("Session for mac address <" .. mac .. "> does not exist, deleting rule.\n");
                assert( os.execute("iptables -t mangle -D allowed_guests -m mac --mac-source " .. mac .. " -j MARK --set-mark 0x2") );
                return 0;
            end
        end
    end, macAddress, tonumber(outgoingPkts), tonumber(outgoingBytes));

    if not status then
        io.stderr:write(error .. "\n");
    end

    -- delete all expired sessions left
    Session.clearExpired();
end
currentRules:close();
return 0;