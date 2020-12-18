# Captive portal for OpenWRT written in LUA

## Overview
This is simple captive portal used by me in conjunction with my [AVR token generator](https://github.com/pamelus/avr-token-generator)
for [OpenWRT](http://openwrt.org/). It provides API token authentication and a controlling unit for avr-token-generator.
Appropriate firewall rules are created automatically. Internet access is given per MAC address after successful token validation.

[![View demo video](https://img.youtube.com/vi/p0FRlCpmJHw/0.jpg)](https://www.youtube.com/watch?v=p0FRlCpmJHw)

## Running captive portal on OpenWRT
You need to configure your OpenWRT a bit to make magic happen. This guide assumes that you have already
[configured a guest WLAN on your device](https://wiki.openwrt.org/doc/recipes/guest-wlan-webinterface).

Once you gave your guest WLAN and firewall zone (`guest`) prepare it to use with captive portal.

1. Disable forwarding from `guest` zone to `wan` zone in general firewall settings, to disable internet connection by
   default.

2. Enable forwarding for validated guests by adding new traffic rule:
	* Protocol: any
	* Source zone: guest
	* Destination zone: wan
	* Action: accept
	* Extra arguments: `-m mark --mark 0x2/0xf`

3. Disable password protection (`Encryption: No Encryption` in "Wireless Security" tab), so everyone will be able to
   connect and see captive portal.

4. Add custom firewall rules required by captive portal. You will need to install `iptables-mod-extra` if you have not
   do so yet.
	```
	opkg update
	opkg install iptables-mod-extra ip6tables-extra
	```

	Then add rules below to your Network / Firewall / Custom Rules.

	```bash
	# Disable redirect for validated guests
	iptables -t nat -A prerouting_guest_rule -m mark --mark 0x2/0xf -j RETURN

	# Allow guests to display captive portal
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 443 -m addrtype --dst-type LOCAL -j RETURN

	# Redirect http traffic to gateway
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 80 -j REDIRECT --to-ports 1080
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 443 -j REDIRECT --to-ports 1043

	# Create allowed guests chain
	iptables -t mangle -N allowed_guests
	iptables -t mangle -A PREROUTING -i guest -j allowed_guests
 
 	# Add redirections also for IPv6
	ip6tables -t mangle -N redirect_guests
	ip6tables -t mangle -A PREROUTING -i br-guest -j redirect_guests
	
	ip6tables -t mangle -A redirect_guests -m mark --mark 0x2/0xf -j RETURN
	ip6tables -t mangle -A redirect_guests -p tcp --dport 443 -m addrtype --dst-type LOCAL -j RETURN
	ip6tables -t mangle -A redirect_guests -p tcp --dport 80 -j TPROXY --on-port 1080
	ip6tables -t mangle -A redirect_guests -p tcp --dport 443 -j TPROXY --on-port 1043
	```

5. Upload `lua-captive-portal` to some path on your router (eg. `/captive`). Install captive portal requirements:

    ```
    opkg update
    opkg install libsqlite3 luasql-sqlite3
    ```
   
6. Create `/var/lib/sqlite` to hold your database files. Database files aren't big, they rarely take more than 100kb, but
   if you're concerned about root disk space, you can change the location by modifying `APPLICATION_DB` in 
   [src/application.lua](src/application.lua)

6. Create uhttpd configuration like this. Please bear in mind this example configuration relies on **UNENCRYPTED**
   traffic, so it's not secure - anyone will be able to sniff entered tokens. Use SSL (eg. from Let's encrypt) to
   address that issue.
	```text
	config uhttpd 'auth'
		list listen_http '0.0.0.0:6820'
		list listen_http '[::]:6820'
		option redirect_https '0'
		option home '/captive/public_html'
		option rfc1918_filter '0'
		option max_requests '3'
		option max_connections '100'
		option cgi_prefix '/'
		option script_timeout '60'
		option network_timeout '30'
		option http_keepalive '20'
		option tcp_keepalive '1'
	```

	And restart uhttpd by `/etc/init.d/uhttpd restart`

7. Link & enable init script that validates guest and restores sessions upon boot.

```bash
	ln -s /captive/devops/init.d/captive /etc/init.d/captive
	/etc/init.d/captive enable
	/etc/init.d/captive start
```

If everything went good you should now have captive portal working once you connect to your guest WiFi network. To create
token you can use `/etc/init.d/captive token` or build a [token generator](https://github.com/pamelus/avr-token-generator).
To list active sessions use `/etc/init.d/captive list`.

## API Specification

API allows you to authorize users by token. To do so, send a POST request under to `http://ROUTER_IP/captive.lua/auth/token`
with following JSON body:

```json
{ "token": "entered token" }
```

It will responsd with 200 status code on success, ot one of 4xx status codes on failure, both with a textual status
summary.

## Captive Portal Frontend

There's another project that [provides captive portal frontend](https://github.com/pamelus/captive-frontend). You can
use it if you don't want to build your own
front-end.

## Development requirements
All you need is text editor and latest docker compose. You can run application locally by simply:
```bash
docker-compose up
```

Docker container binds localhost port 6820 to lua CGI application, so you can access the API through
`http://localhost:6820`.
