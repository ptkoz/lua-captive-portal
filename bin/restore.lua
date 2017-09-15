#!/usr/bin/lua

-- This is script that runs upon boot to restore
-- iptables rules for sessions stored in database.
local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../vendor/?.lua;" .. dirname .. "/../backend/?.lua";

-- bootstrap application (to have database), but not run
require "application".bootstrap(dirname .. "/../backend");

local Session = assert( require "models.session" );
io.stdout:write("Restoring guest sessions.\n");

-- clear expired sessions
Session.clearExpired();

-- restore each valid session
for session in Session.iterator() do
    io.stdout:write("Found session " .. session.mac .. ".\n");
    if session.isValid then
        if not session.isDeployed then
            io.stdout:write("Restoring " .. session.mac .. " session.\n");
            session:restore();
        else
            io.stdout:write("Session " .. session.mac .. " already deployed.\n");
        end;
    else
        io.stdout:write("Session " .. session.mac .. " is invalid.\n");
    end;
end

return 0;