#!/usr/bin/lua

-- Remove given session
local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../vendor/?.lua;" .. dirname .. "/../backend/?.lua";

-- bootstrap application (to have database), but not run
require "application".bootstrap(dirname .. "/../backend");

local Session = assert( require "models.session" );
local mac = arg[1];

if not mac or 0 == mac:len() then
    io.stderr:write("Please provide a session MAC address.\n");
    return 1;
end;

local session = Session.byMac(mac);
if not session then
    io.stderr:write("Session " .. mac .. " not found.\n");
    return 1;
end;

session:delete();
io.stdout:write("Session " .. mac .. " successfully deleted.\n");
return 0;