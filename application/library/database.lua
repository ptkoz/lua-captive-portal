-- This modules allow to open new sqlite3 database and
-- keeps track of all opened connections. Then they all
-- may be closed by simply closeAllDatabases.

local Database = {};

local sqlite3 = assert( require("luasql.sqlite3") );
local nixio = assert( require("nixio") );

local dbenv = assert( sqlite3.sqlite3() );
local connections = { };
local defaultConnection;

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

        connections[dbfile] = dbenv:connect(dbfile);
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