local authController = require "library.controllers.controller";
local Token = require "models.token";
local Session = require "models.session";
local Arp = require "models.arp";

-- authentication by token
function authController:token()
    local params = require "library.input".parse(authController:fetchPostData());
    local L = require "library.language".load(authController:fetchAcceptLanguage());
    self:setResponseHeader("Content-Type", "application/json; charset=UTF-8");

    if not params.token or 0 == params.token:len() then
        self:setResponseStatus("400 Bad request");
        self.responseBody = '"' .. L["Enter the token in the field above."] .. '"';
    else
        local token = Token.byToken(params.token);
        if not token then
            -- token does not exist
            self:setResponseStatus("400 Bad request");
            self.responseBody = '"' .. L["The token you entered is invalid. Generate a new token."] .. '"';
        else if not token.isValid then
            -- token has expired
            self:setResponseStatus("400 Bad request");
            self.responseBody = '"' .. L["Your token has expired. Generate a new token."] .. '"';
        else
            local macAddress = Arp.findMacByIp(os.getenv("REMOTE_ADDR"));
            if macAddress then
                -- token is valid and user is connected to router
                -- immediately expire token, so nobody else will use it
                token:expire();

                -- and create session
                if Session.create(os.getenv("REMOTE_ADDR"), macAddress) then
                    self.responseBody = '"OK"';
                end
            end
        end; end;

        if 0 == self.responseBody:len() then
            self:setResponseStatus("400 Bad request");
            self.responseBody = '"' .. L["A secure connection could not be established. Please try again later."] .. '"';
        end;
    end;
end

return authController;
