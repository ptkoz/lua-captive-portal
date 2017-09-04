#!/usr/bin/lua

-- This is script that runs periodically to validate
-- iptables (-t mangle) allowed_guests chain against
-- sessions table stored in database.

local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../vendor/?.lua;" .. dirname .. "/../application/?.lua";

-- bootstrap application (to have database), but not run
require "application".bootstrap(dirname .. "/../application");

local Token = require("models.token");
local Session = require("models.session");
local nixio = require("nixio");

-- initialize syslog
nixio.openlog("captive-guard");
nixio.syslog("info", "Validating guest sessions.\n");

local currentRules = io.popen("iptables -t mangle -vL allowed_guests");
for rule in currentRules:lines() do
    local outgoingPkts, outgoingBytes, macAddress = rule:match("%s*(%d+)%s+(%d+).-MAC%s+(%S+)");
    if macAddress then
        print(macAddress .. ": " .. outgoingPkts .. " " .. outgoingBytes);
    end
end

nixio.closelog();

return 0;