-- Keeps track of user connected to guest wifi.
-- This module is used by WiFiDog to grant / deny access
-- to the internet.

local Session = {}
Session.__index = Session;

local db = assert( require("library.database").getDatabase() );

-- fetch token data from database
function Session.new(token)
    local cur = db:query("SELECT * FROM sessions WHERE token = ?", token:upper());
    local res = cur:fetch({}, "a");
    cur:close();

    if not res then return nil; end;

    local self = setmetatable(res, Session);
    return self;
end

-- update session's data counters
function Session:updateCounters(incoming, outgoing)
    self.incoming = incoming;
    self.outgoing = outgoing;
    db:query("UPDATE sessions SET incoming = ?, outgoing = ? WHERE token = ?", self.incoming, self.outgoing, self.token);
end

-- extend session time by another 10 minutes
function Session:extend()
    self.expires = os.time() + 600;
    db:query("UPDATE sessions SET expires = ? WHERE token = ?", self.expires, self.token);
end

-- expire session immediatelly and make it unusable
function Session:expire()
    self.expires = os.time() - 1;
    db:execute("UPDATE sessions SET expires = ? WHERE token = ?", self.expires, self.token);
end

-- create new, fresh session in the database
function Session.create(token, ip, mac)
    -- session is valid for 10 minutes since generated
    local expires = os.time() + 600;
    -- put session into database; this will return nil in
    -- case of duplicated token or 1 otherwise.
    local result = db:query("INSERT INTO sessions (token, mac, expires, ip) VALUES(?, ?, ?, ?)", token:upper(), mac:upper(), expires, ip);
    return result;
end

-- remove all expired sessions
function Session.clearExpired()
    local time = os.time();
    return db:query("DELETE FROM sessions WHERE expires <= ?", time);
end

return Session;

