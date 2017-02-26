local module = {};
local APPLICATION_PATH = "";
local APPLICATION_LAYOUT = "";

function module.bootstrap(applicationPath, applicationLayout)
    APPLICATION_PATH = applicationPath;
    APPLICATION_LAYOUT = applicationLayout or applicationPath .. "/views/layout.html";
    return module;
end

function module.hasController(name)
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

function module.dispatch(controller, action, template)
    -- check if module exists
    if not module.hasController(controller) then
        return false;
    end

    local handler = require(controller);

    -- check if action exists
    if nil == handler[action] then
        return false;
    end;

    -- create handler
    local handlerInstance = handler.new(template, APPLICATION_LAYOUT);
    handlerInstance:preAction();
    handlerInstance[action](handlerInstance);
    handlerInstance:postAction();
    handlerInstance:sendResponse();

    return true;
end

function module.run()
    local pathInfo = os.getenv("PATH_INFO") or "";
    local controller = pathInfo:match("^/(%w+)") or "index";
    local action = pathInfo:match("^/%w+/(%w+)") or "index";
    local template = APPLICATION_PATH .. "/views/" .. controller .. "/" .. action .. ".html";

    if not module.dispatch("controllers." .. controller, action, template) then
        module.dispatch("library.controllers.error", "error404", APPLICATION_PATH .. "/library/views/error/error404.html");
    end;
end

return module;