#!/usr/bin/lua

-- This is lua controlling unit daemon for tokenizer device.
-- It receives tokens generated in avr-token-generator, validates
-- them and then - eventually - puts in applicstion database ready
-- to use.

local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../vendor/?.lua;" .. dirname .. "/../application/?.lua";

-- bootstrap application (to have database), but not run
require "application".bootstrap(dirname .. "/../application");

local Token = require("models.token");
local Session = require("models.session");
local nixio = require("nixio");

-- avr-token-generator device serial connection
local device = "/dev/ttyUSB0";

-- initialize syslog
nixio.openlog("tknd");
nixio.syslog("info", "Starting daemon\n");

-- set connection parameters on serial port
nixio.syslog("info", "Setting connection parameters for " .. device .. "\n");
os.execute("stty -F " .. device .. " cs8 9600 ignbrk -brkint -icrnl -imaxbel -opost -onlcr -isig -icanon -iexten -echo -echoe -echok -echoctl -echoke noflsh -ixon -crtscts");

-- open serial port
nixio.syslog("info", "Openning connection to " .. device .. "\n");
local serial = assert( io.open(device, "r+"));

-- Wrap main loop into pcall. This allows script to clean up
-- after some unexpected event, eg. when tokenizer is disconnected
-- from the router.
local status, error = pcall(function()
    nixio.syslog("info", "Entering main loop\n");
    while(1) do
        -- wait for message from the avr-token-generator
        local chunk = serial:read();
        if not chunk then
            error("Lost connection to the " .. device);
        end;

        -- log received message
        nixio.syslog("info", ">> " .. chunk);
        if "TKN:" == chunk:sub(1, 4) then
            -- we have received new token!
            -- clear expired tokens & sessions
            Token.clearExpired();
            Session.clearExpired();

            -- try to create token - this will fail if exact same token
            -- already exists
            if Token.create(chunk:sub(5)) then
                -- token saved, inform device
                serial:write("OK\n");
            else
                -- token already exists, reject
                serial:write("FAIL\n");
            end;

            -- flush data immediatelly
            serial:flush();
        end

        -- cleanup
        chunk = nil;
    end

end);

if not status then
    nixio.syslog("alert", "Main daemon loop finished with error: " .. error .. "\n");
end

nixio.syslog("info", "Closing daemon\n");

serial:close();
nixio.closelog();

return 0;