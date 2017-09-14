#!/usr/bin/lua

-- This is simple script for creating tokens.

local dirname = string.gsub(arg[0], "(.*)/(.*)", "%1");
package.path = package.path .. ";" .. dirname .. "/../vendor/?.lua;" .. dirname .. "/../backend/?.lua";

-- bootstrap application (to have database), bot not run
require "application".bootstrap(dirname .. "/../backend");

local Token = require("models.token");
local Session = require("models.session");

-- clear expired tokens & sessions
Token.clearExpired();
Session.clearExpired();

local charset = {}

-- QWERTYUIOPASDFGHJKLZXCVBNM1234567890
for i = 65, 90 do table.insert(charset, string.char(i)) end
for i = 48, 57 do table.insert(charset, string.char(i)) end

math.randomseed(os.time())

function generate(length)
  local output = "";
  for i = 1, length do
    output = output .. charset[math.random(1, #charset)];
  end
  return output;
end

-- try to create token - this will fail if exact same token
-- already exists
local tkn;
repeat
  tkn = generate(6);
until Token.create(tkn)

print(tkn);
return 0;
