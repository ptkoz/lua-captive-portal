-- Database schema. Called by application if databae file
-- does not exists yet. You may initialize database here.

local schema = {}

-- initialize database given as argument
function schema.create(db)
    -- create table for tokens
    db:execute([[
        CREATE TABLE tokens (
            token CHAR(6) NOT NULL,
            expires INTEGER UNSIGNED NOT NULL,
            PRIMARY KEY(token)
        )
    ]]);

    -- create table for active sessions
    db:execute([[
        CREATE TABLE sessions (
            token CHAR(6) NOT NULL,
            expires INTEGER UNSIGNED NOT NULL,
            ip CHAR(15) NOT NULL,
            mac CHAR(17) NULL DEFAULT NULL,
            incoming BIGINT UNSIGNED NOT NULL DEFAULT 0,
            outgoing BIGINT UNSIGNED NOT NULL DEFAULT 0,
            PRIMARY KEY(token)
        )
    ]]);
end

return schema;

