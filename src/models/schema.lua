-- Database schema. Called by application if databae file
-- does not exists yet. You may initialize database here.

local schema = {}

-- initialize database given as argument
function schema.create(db)
    -- create table for tokens
    assert(db:execute([[
        CREATE TABLE tokens (
            token CHAR(6) NOT NULL,
            expires INTEGER UNSIGNED NOT NULL,
            PRIMARY KEY(token)
        )
    ]]));

    -- create table for active sessions
    assert(db:execute([[
        CREATE TABLE sessions (
            mac CHAR(17) NULL DEFAULT NULL,
            created INTEGER UNSIGNED NOT NULL,
            expires INTEGER UNSIGNED NOT NULL,
            ip CHAR(15) NULL,
            pkts BIGINT UNSIGNED NOT NULL DEFAULT 0,
            bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
            has_warning BOOLEAN NOT NULL DEFAULT 0,
            PRIMARY KEY(mac)
        )
    ]]));
end

return schema;

