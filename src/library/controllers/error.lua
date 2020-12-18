-- Common error404 controller.
local errorController = require "library.controllers.controller";

function errorController:error404()
    self:setResponseStatus("404 Not found");
    self.responseBody = "Page not found";
end;

return errorController;

