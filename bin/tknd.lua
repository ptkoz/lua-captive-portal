#!/usr/bin/lua

-- This is lua controlling unit daemon for tokenizer device.
-- It receives tokens generated in avr-token-generator, validates
-- them and then - eventually - puts in application database ready
-- to use.

local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../src/?.lua";

-- bootstrap application (to have database), but not run
require "application".bootstrap(dirname .. "/../src");

local Token = require("models.token");
local Session = require("models.session");

-- avr-token-generator device serial connection
local device = "/dev/ttyUSB0";

-- initialize syslog
io.stdout:write("Starting daemon\n");

-- set connection parameters on serial port
io.stdout:write("Setting connection parameters for " .. device .. "\n");
os.execute("stty -F " .. device .. " cs8 9600 ignbrk -brkint -icrnl -imaxbel -opost -onlcr -isig -icanon -iexten -echo -echoe -echok -echoctl -echoke noflsh -ixon -crtscts");

-- open serial port
io.stdout:write("Openning connection to " .. device .. "\n");
local serial = assert( io.open(device, "r+"));

-- Wrap main loop into pcall. This allows script to clean up
-- after some unexpected event, eg. when tokenizer is disconnected
-- from the router.
local status, error = pcall(function()
    io.stdout:write("Entering main loop\n");
    while(1) do
        -- wait for message from the avr-token-generator
        local chunk = serial:read();
        if not chunk then
            error("Lost connection to the " .. device);
        end;

        -- log received message
        io.stdout:write(">> " .. chunk);
        if "TKN:" == chunk:sub(1, 4) then
            -- we have received new token!
            -- clear expired tokens
            Token.clearExpired();

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
    io.stderr:write("Main daemon loop finished with error: " .. error .. "\n");
end

io.stdout:write("Closing daemon\n");

serial:close();
return 0;