-- This module may be used as basis for application
-- controllers. It can handle CGI headers, inputs
-- output buffering and some more.
local Controller = {}
Controller.__index = Controller;

-- Controller's constructor.
function Controller.new()
    local self = setmetatable({}, Controller);

    -- set some basic defaults
    self.responseBody = "";
    self.responseHeaders = {
        ["Status"] = "200 OK",
        ["Cache-Control"] = "no-store, no-cache, must-revalidate",
        ["Access-Control-Allow-Origin"] = "*",
        ["Pragma"] = "no-cache",
        ["Expires"] = "Thu, 19 Nov 1981 08:52:00 GMT",
        ["Date"] = os.date("%a, %d %b %Y %H:%M:%S GMT", os.time(os.date("!*t"))),
        ["Content-Type"] = "text/html; charset=UTF-8"
    }

    return self;
end

-- get raw query string
function Controller:fetchGetData()
    return os.getenv("QUERY_STRING");
end

-- get raw post data (only x-www-form-urlencoded forms are supported)
function Controller:fetchPostData()
    return io.read("*all");
end

-- get accept language list -- en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6
function Controller:fetchAcceptLanguage()
    local langs = {}
    for patt in string.gmatch(os.getenv("HTTP_ACCEPT_LANGUAGE") or "en-US,en;q=0.9", "([^,]+)") do
        local lang = string.match(patt, "([^;]+)")
        if lang then
            table.insert(langs, lang)
        end
    end
    return langs
end

-- Set / replace response header
function Controller:setResponseHeader(name, value)
    self.responseHeaders[name] = value;
end

-- Set response status code & message
function Controller:setResponseStatus(status)
    self:setResponseHeader("Status", status);
end

-- Enable browser cache for given page.
function Controller:enableBrowserCache()
    self:setResponseHeader("Cache-Control", "cache");
    self:setResponseHeader("Pragma", "cache");
    self:setResponseHeader("Expires", os.date("%s, %d %b %Y %H:%M:%S GMT", os.time(os.date("!*t")) + 600));
end

-- Redorect user to given url with given redirection code.
-- If external evaluates to false, url will be prefixed
-- by SCRIPT_NAME
function Controller:redirect(location, code, external)
    if not code then
        code = 303;
    end;

    if not external then
        location = os.getenv("SCRIPT_NAME") .. location;
    end

    self:setResponseStatus(code .. " Redirect");
    self:setResponseHeader("Location", location);
end

-- abstract method to overload in controller, called before any action call
function Controller:preAction() end;
-- abstract method to overload in controller, called after any action call
function Controller:postAction() end;

-- send response headers & body
function Controller:sendResponse()
    -- send response headers
    table.foreach(self.responseHeaders, function(name, value)
        io.write(name, ": ", value, "\n");
    end);

    -- empty line after headers
    io.write("\n");

    -- send response body
    io.write(self.responseBody);
end

return Controller;
