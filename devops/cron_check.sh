#!/bin/bash

[ -f "/etc/crontabs/root" ] && grep -q '/etc/init.d/gguard' /etc/crontabs/root && return
    echo "*/10 * * * * /etc/init.d/gguard start" >> /etc/crontabs/root
    /etc/init.d/cron start