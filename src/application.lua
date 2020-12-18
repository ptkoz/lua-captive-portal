-- Bootstrap & run lua web application. This module
-- sets several global variables and initializes other
-- commonly used modules (eg. database).

local Database = require("library.database");
local Application = {};

APPLICATION_PATH = "";
APPLICATION_DB = "";

-- Bootstrap application. Init global variables and environment.
function Application.bootstrap(applicationPath)
    APPLICATION_PATH = applicationPath;
    APPLICATION_DB = "/var/lib/sqlite/captive.db";

    -- connect to sqlite db file.
    local db, initDb = Database.getDatabase(APPLICATION_DB, true);

    if initDb then
        -- database file does not exists, initialize database
        require("models.schema").create(db);
    end;

    return Application;
end

-- Check whether given controller exists. Function
-- copier from stackoverflow.com.
function Application.hasController(name)
    if package.loaded[name] then
        return true
    else
        for _, searcher in ipairs(package.searchers or package.loaders) do
            local loader = searcher(name)
            if type(loader) == 'function' then
                package.preload[name] = loader
                return true
            end
        end
        return false
    end
end

-- Dispatch controller & action. This function return true
-- if controller & action exists and false otherwise.
function Application.dispatch(controller, action)
    -- check if module exists
    if not Application.hasController(controller) then
        return false;
    end

    local handler = require(controller);

    -- check if action exists
    if nil == handler[action] then
        return false;
    end;

    -- create handler
    local handlerInstance = handler.new();
    handlerInstance:preAction();
    if "OPTIONS" ~= os.getenv("REQUEST_METHOD") then
        handlerInstance[action](handlerInstance);
    end
    handlerInstance:postAction();
    handlerInstance:sendResponse();

    return true;
end

-- Run the application. Parse given URL and dispatch :controller/:action
-- ot default :controller/index or defaut index/index
function Application.run()
    local pathInfo = os.getenv("PATH_INFO") or "";
    local controller = pathInfo:match("^/(%w+)") or "index";
    local action = pathInfo:match("^/%w+/(%w+)") or "index";

    if not Application.dispatch("controllers." .. controller, action) then
        Application.dispatch("library.controllers.error", "error404");
    end;

    Database.closeAllDatabases();
end

return Application;