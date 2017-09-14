#!/usr/bin/lua

-- Main application entrypoint.
local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../../vendor/?.lua;" .. dirname .. "/../../backend/?.lua";

-- Bootstrap & run application.
require "application".bootstrap(dirname .. "/../../backend").run();