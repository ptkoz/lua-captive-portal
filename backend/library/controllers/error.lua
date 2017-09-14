-- Common error404 controller.
local errorController = require "library.controllers.controller";

function errorController:error404()
    self:setResponseStatus("404 Not found");

    local errorFile = assert( io.open(APPLICATION_PATH .. "/../public_html/error404.html") );
    self.responseBody = errorFile:read("*all");
    errorFile:close();

end;

return errorController;

