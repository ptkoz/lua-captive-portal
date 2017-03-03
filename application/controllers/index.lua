local indexController = require "library.controllers.controller";
local Token = require "models.token";
local Session = require "models.session";

-- the login screen
function indexController:index()
    self.view.title = "Podaj token - FC Goście";

    if "POST" == os.getenv("REQUEST_METHOD") then
        local params = require "library.input".parse(indexController:fetchPostData());

        if not params.token then
            self.view.token = params.token; -- not actually required, but left for convenince
            self.view.hasError = true;
            self.view.errorNoToken = true;
        else
            local token = Token.new(params.token);
            if not token then
                -- token does not exist
                self.view.token = params.token;
                self.view.hasError = true;
                self.view.errorInvalidToken = true;
            else if token.expires <= os.time() then
                -- token has expired
                self.view.token = params.token;
                self.view.hasError = true;
                self.view.errorTokenExpired = true;
            else
                -- this token is valid and can be used - create session
                Session.create(token.token, os.getenv("REMOTE_ADDR"));
                -- immediately expire token, so nobody else will use it
                token:expire();
                -- redirect user to wifidog portal
                return self:redirect("http://auth.wro.tuxlan.es:2060/wifidog/auth?token=" .. token.token, 303, true);
            end; end;
        end;

    end
end

-- this message is shown when user successfully authenticates
function indexController:success()
    self.view.title = "Gotowe - FC Goście";

    self:enableBrowserCache();
end

-- this message is shown when user session expires
function indexController:error()
    self.view.title = "Sesja wygasła - FC Goście";
    self:enableBrowserCache();
end

return indexController;