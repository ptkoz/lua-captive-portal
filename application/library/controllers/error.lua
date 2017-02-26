local controller = require "library.controllers.controller";

function controller:error404()
    self:setResponseStatus("404 Not found");
end;

return controller;

