# Captive portal for OpenWRT written in LUA

## Overview
This is simple captive portal used by me in conjunction with my [Captive Portal Frontend](https://github.com/pamelus/captive-frontend)
and [AVR token generator](https://github.com/pamelus/avr-token-generator) for [OpenWRT](http://openwrt.org/). It provides
token authentication API and a controlling unit for AVR Token Generator. Appropriate firewall rules are created automatically.
Internet access is given per MAC address after successful token validation.

[![View demo video](https://img.youtube.com/vi/p0FRlCpmJHw/0.jpg)](https://www.youtube.com/watch?v=p0FRlCpmJHw)

## Running captive portal on OpenWRT
You need to configure your OpenWRT a bit to make magic happen. This guide assumes that you have already
[configured a guest WLAN on your device](https://wiki.openwrt.org/doc/recipes/guest-wlan-webinterface).

Once you gave your guest WLAN and firewall zone (`guest`) prepare it to use with captive portal.

1. Disable forwarding from `guest` zone to `wan` zone in general firewall settings, to disable internet connection by
   default.

2. Enable forwarding for validated guests by adding new traffic rule:
    * Address family: IPv4 and IPv6 
	* Protocol: any
	* Source zone: guest
	* Destination zone: wan
	* Action: accept
	* Extra arguments: `-m mark --mark 0x2/0xf`

3. Allow unvalidated guest to see captive portal:
    * Address family: IPv4 and IPv6
    * Protocol: tcp
    * Source zone: guest
    * Destination zone: Device (input)
    * Destination port: 6820-6822  
    * Action: accept
    * Extra arguments: `-m mark --mark 0x0/0xf`

3. Disable password protection (`Encryption: No Encryption` in "Wireless Security" tab), so everyone are able to
   connect and see captive portal.

4. Add custom firewall rules required by captive portal. You will need to install `iptables-mod-extra` if you have not
   do so yet.
	```bash
	opkg update
	opkg install iptables-mod-extra ip6tables-extra
	```

	Then add rules below to your Network / Firewall / Custom Rules.

	```bash
	# Disable redirect for validated guests
	iptables -t nat -A prerouting_guest_rule -m mark --mark 0x2/0xf -j RETURN

	# Allow guests to display captive portal
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 6820:6822 -m addrtype --dst-type LOCAL -j RETURN

	# Handle all HTTP traffic by the router itself
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 80 -j REDIRECT --to-ports 6821
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 443 -j REDIRECT --to-ports 6821

	# Create allowed guests chain
	iptables -t mangle -N allowed_guests
	iptables -t mangle -A PREROUTING -i guest -j allowed_guests
 
 	# Add redirections also for IPv6
	ip6tables -t mangle -N redirect_guests
	ip6tables -t mangle -A PREROUTING -i br-guest -j redirect_guests
	
	ip6tables -t mangle -A redirect_guests -m mark --mark 0x2/0xf -j RETURN
	ip6tables -t mangle -A redirect_guests -p tcp --dport 6820:6822 -m addrtype --dst-type LOCAL -j RETURN
	ip6tables -t mangle -A redirect_guests -p tcp --dport 80 -j TPROXY --on-port 6821
	ip6tables -t mangle -A redirect_guests -p tcp --dport 443 -j TPROXY --on-port 6821
	```

5. Install captive portal requirements:

    ```bash
    opkg update
    opkg install libsqlite3 luasql-sqlite3
    ```
   
6. Clone this repository and upload its contents to a known path on your router (eg. `/captive/api`), so that `/captive/api/public_html/captive.lua`
   file exists. On Linux & MacOS you can use deployment script attached: `./deploy.sh root@192.168.1.1:/captive/api`. 
 
7. Clone [Captive Frontend](https://github.com/pamelus/captive-frontend), build it (see captive frontend's readme) and
   upload its `public_html` directory contents to a known path on your router (eg. `/captive/frontend`), so that `/captive/frontend/index.html`
   file exist. 

7. Create `/lib/sqlite` to hold your database files. Database files aren't big, they rarely take more than 100kb, but
   if you're concerned about root disk space, you can change the location by modifying `APPLICATION_DB` in 
   [src/application.lua](src/application.lua)

8. Create uhttpd configuration like this. Please bear in mind this example configuration relies on **UNENCRYPTED**
   traffic, so it's not secure - anyone will be able to sniff entered tokens. Use SSL (eg. from Let's encrypt) to
   address that issue.
   
	```text
	config uhttpd 'captive_api'
		list listen_http '0.0.0.0:6820'
		list listen_http '[::]:6820'
		option redirect_https '0'
		option home '/captive/api/public_html'
		option rfc1918_filter '0'
		option max_requests '3'
		option max_connections '100'
		option cgi_prefix '/'
		option script_timeout '60'
		option network_timeout '30'
		option http_keepalive '20'
		option tcp_keepalive '1'
 
    config uhttpd 'captive_frontend'
		list listen_http '0.0.0.0:6821'
		list listen_http '[::]:6821'
		option home '/captive/frontend'
		option rfc1918_filter '0'
		option max_requests '3'
		option max_connections '100'
		option network_timeout '30'
		option http_keepalive '20'
		option tcp_keepalive '1'
		option error_page '/index.html'
	```

	And restart uhttpd by `/etc/init.d/uhttpd restart`. Have you noticed listen port numbers for frontend match port
    numbers we redirected the traffic to when we were defining firewall rules? 

9. Link & enable init script that validates guest and restores sessions upon boot.

```bash
	ln -s /captive/api/init.d/captive /etc/init.d/captive
	/etc/init.d/captive enable
	/etc/init.d/captive start
```

If everything went good you should now have captive portal working once you connect to your guest WiFi network. To create
token you can use `/etc/init.d/captive token` or build a [token generator](https://github.com/pamelus/avr-token-generator).
To list active sessions use `/etc/init.d/captive list`.

## API Specification

API allows you to authorize users by token. To do so, send a POST request under to `http://ROUTER_IP/captive.lua/auth/token`
with `token` specified as form data. It responds with 200 status code on success, or one of 4xx status codes on failure,
both with a textual status summary.

## Development requirements
All you need is text editor and latest docker compose. You can run application locally by simply:
```bash
docker-compose up
```

Docker container binds localhost port 6820 to lua CGI application, so you can access the API through
`http://localhost:6820`.
