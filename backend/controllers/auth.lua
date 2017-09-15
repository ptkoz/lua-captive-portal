local authController = require "library.controllers.controller";
local Token = require "models.token";
local Session = require "models.session";
local Arp = require "models.arp";

-- authentication by token
function authController:token()
    local params = require "library.input".parse(authController:fetchPostData());
    self:setResponseHeader("Content-Type", "application/json; charset=UTF-8");

    if not params.token or 0 == params.token:len() then
        self:setResponseStatus("400 Bad request");
        self.responseBody = '"Wpisz token w polu powyżej."';
    else
        local token = Token.byToken(params.token);
        if not token then
            -- token does not exist
            self:setResponseStatus("400 Bad request");
            self.responseBody = '"Wpisany token jest nieprawidłowy. Wygeneruj nowy token."';
        else if not token.isValid then
            -- token has expired
            self:setResponseStatus("400 Bad request");
            self.responseBody = '"Ważność Twojego tokena wygasła. Wygeneruj nowy token."';
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
            self.responseBody = '"Nie udało się zestawić bezpiecznego połączenia. Spróbuj ponownie później."';
        end;
    end;
end

return authController;