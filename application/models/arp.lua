--- two simple functions for finding IP & MAC addreses

function searchArp(callback)
    local f = assert( io.open("/proc/net/arp") );

    for line in f:lines() do
        local result = callback(line);
        if result then
            f:close();
            return result;
        end;
    end

    f:close();
    return nil;
end

return {
    findMacByIp = function(ip)
        local ipAddressLength = ip:len();
        return searchArp(function(line)
            if line:sub(1, ipAddressLength) == ip then
                return line:match(".-%s+.-%s+.-%s(%S+)");
            else
                return nil;
            end;
        end);
    end,

    findIpByMac = function(mac)
        return searchArp(function(line)
            return line:match("%s*([0-9\.]+).*" .. mac:lower())
        end);
    end
}