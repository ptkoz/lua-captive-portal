local template = require "resty.template";

local Controller = {}
Controller.__index = Controller;

function Controller.new(script, layout)
    local self = setmetatable({}, Controller);
    self.enableRender = true;
    self.view = template.new(script, layout);

    self.responseBody = "";
    self.responseHeaders = {
        ["Status"] = "200 OK",
        ["Cache-Control"] = "no-store, no-cache, must-revalidate",
        ["Pragma"] = "no-cache",
        ["Expires"] = "Thu, 19 Nov 1981 08:52:00 GMT",
        ["Date"] = os.date("%s, %d %b %Y %H:%M:%S GMT", os.time(os.date("!*t"))),
        ["Content-Type"] = "text/html; charset=UTF-8"
    }

    return self;
end

function Controller:setResponseHeader(name, value)
    self.responseHeaders[name] = value;
end

function Controller:setResponseStatus(status)
    self:setResponseHeader("Status", status);
end

function Controller:enableBrowserCache()
    self:setResponseHeader("Cache-Control", "cache");
    self:setResponseHeader("Pragma", "cache");
    self:setResponseHeader("Expires", os.date("%s, %d %b %Y %H:%M:%S GMT", os.time(os.date("!*t")) + 600));
end

function Controller:redirect(location, code, external)
    if not code then
        code = 303;
    end;

    if not external then
        location = os.getenv("SCRIPT_NAME") .. location;
    end

    self:setResponseStatus(code .. " Redirect");
    self:setResponseHeader("Location", location);
    self.enableRender = false;
end

function Controller:preAction() end;
function Controller:postAction() end;

function Controller:sendResponse()
    -- send response headers
    table.foreach(self.responseHeaders, function(name, value)
        print(name .. ": " .. value);
    end);

    -- empty line after headers
    print();

    -- send response body - either parsed template od responseBody string
    if self.enableRender then
        self.view:render();
    else
        print(self.responseBody);
    end
end

return Controller;