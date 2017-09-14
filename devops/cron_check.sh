#!/bin/bash

if [ -f "/etc/crontabs/root" ] && grep -q '/etc/init.d/gguard' /etc/crontabs/root; then
	echo "GuestGuard cron present."
else
	echo "Creating GuestGuard cron."
    echo "*/10 * * * * /etc/init.d/gguard start" >> /etc/crontabs/root
    /etc/init.d/cron start
fi