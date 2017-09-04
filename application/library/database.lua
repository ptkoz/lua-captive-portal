-- This modules allow to open new sqlite3 database and
-- keeps track of all opened connections. Then they all
-- may be closed by simply closeAllDatabases.

local Database = {};
local Instance = {};
Instance.__index = Instance;

local sqlite3 = assert( require("luasql.sqlite3") );
local nixio = assert( require("nixio") );

local dbenv = assert( sqlite3.sqlite3() );
local connections = { };
local defaultConnection;

function Instance.new(conn)
    local self = setmetatable({}, Instance);
    self.conn = conn;
    return self;
end

function Instance:escape(value)
    return self.conn:escape(value);
end

function Instance:query(stmt, ...)
    local paramIndex = 1;

    local parsedStmt = stmt:gsub("?", function()
        local value = arg[paramIndex];
        paramIndex = paramIndex + 1;

        if value then
            return "'" .. self.conn:escape(tostring(value)) .. "'";
        else
            return "NULL";
        end;
    end)

    return self:execute(parsedStmt);
end;

function Instance:execute(stmt)
    return self.conn:execute(stmt);
end

function Instance:close()
    return self.conn:close();
end

-- Get database connection. Will be created if not exists.
-- Second returned value indicate whether database initialization
-- is required.
function Database.getDatabase(dbfile, setDefault)
    local initRequired;

    if nil == dbfile then
        dbfile = defaultConnection;
    end

    if nil == connections[dbfile] then
        if "reg" ~= nixio.fs.stat(dbfile, "type") then
            initRequired = true;
        end

        local conn = dbenv:connect(dbfile);
        connections[dbfile] = Instance.new(conn);
    end

    if setDefault then
        defaultConnection = dbfile;
    end

    return connections[dbfile], initRequired;
end


-- Close all opened connections
function Database.closeAllDatabases()
    table.foreach(connections, function(dbfile, db) db:close(); end)
    dbenv:close();
end

return Database;