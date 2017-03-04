local aboutController = require "library.controllers.controller";

function aboutController:motivation()
    self:enableBrowserCache();
    self.view.title = "Dlaczego token zamiast hasła - FC Goście"
end

function aboutController:geekness()
    self:enableBrowserCache();
    self.view.title = "Dlaczego mi się chciało - FC Goście"
end

return aboutController;