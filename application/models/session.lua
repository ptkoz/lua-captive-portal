-- Keeps track of user connected to guest wifi and manage
-- corresponding iptables rule

local Session = {}
Session.__index = Session;

local db = assert( require("library.database").getDatabase() );

-- fetch session data from database
function Session.new(mac)
    local cur = db:query("SELECT * FROM sessions WHERE mac = ?", mac:upper());
    local res = cur:fetch({}, "a");
    cur:close();

    if not res then return nil; end;

    -- record exists, check whether corresponding iptables
    -- rule is still there
    if 0 ~= os.execute("iptables -t mangle -C allowed_guests -m mac --mac-source " .. mac .. " -j MARK --set-mark 0x2") then
        -- everyting is OK
        local self = assert( setmetatable(res, Session) );
        return self;
    else
        -- iptables rule has vanished, delete session
        assert( db:query("DELETE FROM sessions WHERE mac = ?", mac:upper()) );
        return nil;
    end
end

-- update session's data counters
function Session:updateCounters(incoming, outgoing)
    self.incoming = incoming;
    self.outgoing = outgoing;
    db:query("UPDATE sessions SET incoming = ?, outgoing = ? WHERE mac = ?", self.incoming, self.outgoing, self.mac);
end

-- delete session and corresponding rule
function Session:delete()
    assert( db:query("DELETE FROM sessions WHERE mac = ?", self.mac) );
    assert( os.execute("iptables -t mangle -D allowed_guests -m mac --mac-source " .. self.mac .. " -j MARK --set-mark 0x2") );
    self = nil;
end

-- create new, fresh session in the database
-- and add iptables rule
function Session.create(ip, mac)
    local session = Session.new(mac);

    -- already exists
    if session then
        if session.ip ~= ip then
            -- ip collision, delete previous session
            -- for extra security
            session:delete();
            return false;
        else
            return true;
        end;
    end;

    -- create new session
    -- session is valid for 24 hours
    local expires = os.time() + 86400;
    -- put session into database; this will return nil in
    -- case of duplicated mac or 1 otherwise.
    assert( db:query("INSERT INTO sessions (mac, expires, ip) VALUES(?, ?, ?)", mac:upper(), expires, ip) );
    assert( os.execute("iptables -t mangle -A allowed_guests -m mac --mac-source " .. mac .. " -j MARK --set-mark 0x2") );
    return true;
end

-- remove all expired sessions
function Session.clearExpired()
    local time = os.time();
    return db:query("DELETE FROM sessions WHERE expires <= ?", time);
end

return Session;

