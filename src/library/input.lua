-- This module parses application/x-form-urlencoded raw post data
-- (and also query string data).
local input = {};

-- urldecode variable
function input.urldecode(value)
    return value:gsub("%%(%x%x)", function(c) return string.char(tonumber(c, 16)); end):gsub("+", " ");
end

-- parse query string or application/x-form-urlencoded raw data
-- and return friendly table
function input.parse(query)
    local params = {};

    -- split by "&"
    for part in query:gmatch("[^&]+") do
        local args = {};

        -- split by "="
        for arg in part:gmatch("[^=]+") do
            table.insert(args, arg);
        end

        -- name is before first "=" sign
        local name = table.remove(args, 1);
        -- everything after name should be joined, as it is value
        local value = table.concat(args, "=");

        -- put param into table
        params[input.urldecode(name)] = input.urldecode(value or "");
    end

    -- return params table
    return params;
end

return input;

