#!/usr/bin/lua

-- Main application entrypoint.
local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../../vendor/?.lua;" .. dirname .. "/../../application/?.lua";

-- Bootstrap & run application.
require "application".bootstrap(dirname .. "/../../application").run();