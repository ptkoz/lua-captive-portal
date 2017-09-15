#!/usr/bin/lua

-- List active guest sessions
local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../vendor/?.lua;" .. dirname .. "/../backend/?.lua";

-- bootstrap application (to have database), but not run
require "application".bootstrap(dirname .. "/../backend");

local Session = assert( require "models.session" );

-- clear expired sessions
Session.clearExpired();

local count = 0;
-- restore each valid session
for session in Session.iterator() do
    io.stdout:write("Found session " .. session.mac .. ".\n");
    io.stdout:write("\tValid:\t\t" .. tostring(session.isValid) .. "\n");
    io.stdout:write("\tDeployed:\t" .. tostring(session.isDeployed) .. "\n");
    io.stdout:write("\tIP:\t\t" .. tostring(session.ip) .. "\n");
    io.stdout:write("\tCreated:\t" .. os.date("%a, %d %b %Y %H:%M:%S GMT", session.created) .. "\n");
    io.stdout:write("\tExpires:\t" .. os.date("%a, %d %b %Y %H:%M:%S GMT", session.expires) .. "\n");
    count = count + 1;
end;

io.stdout:write("Total " .. tostring(count) .. " sessions.\n");

return 0;