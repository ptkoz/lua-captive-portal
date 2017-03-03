local aboutController = require "library.controllers.controller";

-- login screen
function aboutController:index()
    if "POST" == os.getenv("REQUEST_METHOD") then
        local params = require "library.input".parse(aboutController:fetchPostData());

        if not params.token then
            self.view.token = params.token;
            self.view.hasError = true;
            self.view.errorNoToken = true;
        else
            local token = Token.new(params.token);
            if not token then
                self.view.token = params.token;
                self.view.hasError = true;
                self.view.errorInvalidToken = true;
            else if token.expires <= os.time() then
                self.view.token = params.token;
                self.view.hasError = true;
                self.view.errorTokenExpired = true;
            else
                Session.create(token.token, os.getenv("REMOTE_ADDR")); -- create new session for user
                token:expire(); -- immediately expire token
                return self:redirect("http://auth.wro.tuxlan.es:2060/wifidog/auth?token=" .. token.token, 303, true);
            end; end;
        end;

    end
end

-- screen after successful auth
function aboutController:success()

end

-- screen after failed auth
function aboutController:error()

end

return aboutController;