-- This modules auto loads language due to request.
local language = {};

local function loadLangPack(lang)
    local status, res = pcall(require, "language/" .. string.lower(lang))
    if status and type(res) == "table" then
        local lang = {}
        for k, v in pairs(res) do
            lang[k] = v
        end
        return lang
    end
    return nil
end

-- auto load language
function language.load(langList)
    local base = setmetatable(loadLangPack("en-US") or {}, {
        __index = function(_, k) return k end,
        __call = function(t, k, ...) return string.format(t[k], ...) end,
    })
    for i = #langList, 1, -1 do
        local lang = loadLangPack(langList[i])
        if type(lang) == "table" then
            setmetatable(lang, {
                __index = base,
                __call = function(t, k, ...) return string.format(t[k], ...) end,
            })
            base = lang
        end
    end
    return base
end

return language;
