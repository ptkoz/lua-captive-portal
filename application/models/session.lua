-- Keeps track of user connected to guest wifi.
-- This module is used by WiFiDog to grant / deny access
-- to the internet.

local Session = {}
Session.__index = Session;

local db = assert( require("library.database").getDatabase() );

-- fetch session data from database
function Session.new(mac)
    local cur = db:query("SELECT * FROM sessions WHERE mac = ?", mac:upper());
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
    db:query("UPDATE sessions SET incoming = ?, outgoing = ? WHERE mac = ?", self.incoming, self.outgoing, self.mac);
end

-- extend session time by another 24 hours
function Session:extend()
    self.expires = os.time() + 600;
    db:query("UPDATE sessions SET expires = ? WHERE mac = ?", self.expires, self.mac);
end

-- expire session immediatelly and make it unusable
function Session:expire()
    self.expires = os.time() - 1;
    db:execute("UPDATE sessions SET expires = ? WHERE mac = ?", self.expires, self.mac);
end

-- create new, fresh session in the database
function Session.create(ip, mac)
    -- session is valid for 24 hours
    local expires = os.time() + 86400;
    -- put session into database; this will return nil in
    -- case of duplicated mac or 1 otherwise.
    local result = db:query("INSERT INTO sessions (mac, expires, ip) VALUES(?, ?, ?, ?)", mac:upper(), expires, ip);
    return result;
end

-- remove all expired sessions
function Session.clearExpired()
    local time = os.time();
    return db:query("DELETE FROM sessions WHERE expires <= ?", time);
end

return Session;

