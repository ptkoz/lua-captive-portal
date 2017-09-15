#!/bin/bash

if [ -f "/etc/crontabs/root" ] && grep -q '/etc/init.d/captive guard' /etc/crontabs/root; then
	echo "Captive guard cron present."
else
	echo "Creating captive guard cron."
    echo "*/10 * * * * /etc/init.d/captive guard" >> /etc/crontabs/root
    /etc/init.d/cron start
fi