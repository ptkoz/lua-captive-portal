local apiController = require "library.controllers.controller";
local Session = require "models.session";

-- Get session by params passed by GET
local getValidatedSession = function(params)
    -- not token = no session
    if not params.token then return nil; end;

    -- search for session in the DB
    local session = Session.new(params.token);

    -- check if session exists and it's not expired
    if not session then return nil; end;
    if session.expires <= os.time() then return nil; end;

    -- validate session and expire immediately on any error
    if not params.ip or session.ip ~= params.ip then
        session:expire();
        return nil;
    end;

    -- session's mac may be nil on first auth request
    if not params.mac or (session.mac and params.mac ~= session.mac) then
        session:expire();
        return nil;
    end;

    return session;
end

-- Respond to ping requests from WiFiDog
function apiController:ping()
    self:setResponseHeader("Content-Type", "text/plain; charset=UTF-8");
    self.enableRender = false;
    self.responseBody = "Pong";
end

-- Check WiFiDog session status
function apiController:auth()
    self:setResponseHeader("Content-Type", "text/plain; charset=UTF-8");
    self.enableRender = false;

    -- parse input and obtain session
    local params = require "library.input".parse(self:fetchGetData());
    local session = getValidatedSession(params);

    -- prepare auth result for WiFiDog
    local authResult;

    if session then
        -- we have valid session, let's extend it by another 10 minutes
        session:extend();

        -- if session does not have mac yet, let's set it
        if not session.mac then
            session:updateMac(params.mac);
        end

        -- update bandwidth counters
        if params.stage and "counters" == params.stage and params.incoming and params.outgoing then
            session:updateCounters(params.incoming, params.outgoing);
        end

        authResult = 1;
    else
        -- there is no session or session has expired - log user out
        authResult = 0;
    end

    self.responseBody = "Auth: " .. authResult;
end



return apiController;