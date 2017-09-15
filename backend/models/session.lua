-- Keeps track of user connected to guest wifi and manage
-- corresponding iptables rule

local Session = {}
Session.__index = Session;

local db = assert( require("library.database").getDatabase() );

-- iterate through all sessions
function Session.iterator()
    local cur = assert( db:query("SELECT * FROM sessions"))
    local row = {};
    return function()
        row = cur:fetch(row, "a");
        if row then
            return Session.factory(row);
        else
            return nil;
        end;
    end
end

-- fetch session data from database by MAC address
function Session.byMac(mac)
    local cur = assert( db:query("SELECT * FROM sessions WHERE mac = ?", mac:upper()) );
    local res = cur:fetch({}, "a");
    cur:close();

    if not res then return nil; end;
    return Session.factory(res);
end

function Session.factory(data)
    local self = assert( setmetatable(data, Session) );

    -- session is valid if not expired
    self.isValid = self.expires > os.time();

    -- session is deployed when ipdatbles rule is present
    self.isDeployed = 0 == os.execute("iptables -t mangle -C allowed_guests -m mac --mac-source " .. self.mac .. " -j MARK --set-mark 0x2 2>/dev/null");

    return self;
end

-- update session's data counters
function Session:updateCounters(pkts, bytes)
    self.pkts = pkts;
    self.bytes = bytes;
    assert( db:query("UPDATE sessions SET pkts = ?, bytes = ? WHERE mac = ?", self.pkts, self.bytes, self.mac) );
end

-- update session's IP
function Session:updateIp(ip)
    self.ip = ip;
    assert( db:query("UPDATE sessions SET ip = ? WHERE mac = ?", self.ip, self.mac) );
end

-- extend session lifetime
function Session:extend()
    local maxExpire = self.created + 345600;
    self.expires = os.time() + 86400;

    -- session cannot live longer than 4 days
    if self.expires > maxExpire then
        self.expires = maxExpire;
    end;

    assert( db:query("UPDATE sessions SET expires = ? WHERE mac = ?", self.expires, self.mac) );
end

-- restore session into iptables
function Session:restore()
    if not self.isDeployed then
        -- after reboot ip may change - delete old IP from session data
        -- guard will set new IP once available
        self:updateIp(nil);

        -- add lacking rule
        assert( os.execute("iptables -t mangle -A allowed_guests -m mac --mac-source " .. self.mac .. " -j MARK --set-mark 0x2 -c " .. self.pkts .. " " .. self.bytes) );
    
        self.isDeployed = true;
    end;
end

-- delete session and corresponding rule
function Session:delete()
    assert( db:query("DELETE FROM sessions WHERE mac = ?", self.mac) );
    if self.isDeployed then
        assert( os.execute("iptables -t mangle -D allowed_guests -m mac --mac-source " .. self.mac .. " -j MARK --set-mark 0x2") );
    end;
    self = nil;
end

-- create new, fresh session in the database
-- and add iptables rule
function Session.create(ip, mac)
    local session = Session.byMac(mac);

    -- already exists
    if session then
        if not session.isDeployed then
            -- iptables rule for previous session not present
            -- delete it for extra security
            session:delete();
            return false;
        end;

        if session.ip ~= ip then
            -- ip collision, delete previous session
            -- for extra security
            session:delete();
            return false;
        end;

        if session.isValid then
            -- previous session is valid and may be used
            return true;
        else
            -- previous session has expired, delete it to make
            -- space for new one
            session:delete();
        end;
    end;

    -- create new session
    -- session is valid for 24 hours
    local expires = os.time() + 86400;
    -- put session into database; this will return nil in
    -- case of duplicated mac or 1 otherwise.
    if assert(db:query("INSERT INTO sessions (mac, created, expires, ip) VALUES(?, ?, ?, ?)", mac:upper(), os.time(), expires, ip)) then
        assert( os.execute("iptables -t mangle -A allowed_guests -m mac --mac-source " .. mac .. " -j MARK --set-mark 0x2") );
        return true;
    else
        return false;
    end;
end

-- remove all expired sessions
function Session.clearExpired()
    local time = os.time();
    return assert( db:query("DELETE FROM sessions WHERE expires <= ?", time) );
end

return Session;

