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
                local f = assert( io.open("/proc/net/arp") );
                local macAddress;
                local ipAddress = os.getenv("REMOTE_ADDR");
                local ipAddressLength = ipAddress:len();
                for line in f:lines() do
                    if line:sub(1, ipAddressLength) == ipAddress then
                        macAddress = line:match(".-%s+.-%s+.-%s(%S+)");
                        break;
                    end
                end

                f:close();

                if macAddress then
                    -- this token is valid and can be used - create session
                    if 0 ~= os.execute("iptables -t mangle -C allowed_guests -m mac --mac-source " .. macAddress .. " -j MARK --set-mark 0x2") then
                        -- but only if mac address is not yet present in iptables
                        Session.clearExpired();
                        Session.create(os.getenv("REMOTE_ADDR"), macAddress);
                        os.execute("iptables -t mangle -A allowed_guests -m mac --mac-source " .. macAddress .. " -j MARK --set-mark 0x2")
                    end

                    -- immediately expire token, so nobody else will use it
                    token:expire();

                    -- redirect user to thank you page
                    return self:redirect("/index/success");

                else
                    self.view.token = params.token;
                    self.view.hasError = true;
                    self.view.errorTokenExpired = true;
                end
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