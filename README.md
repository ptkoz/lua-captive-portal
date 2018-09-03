# Captive portal for OpenWRT written in LUA

## Overview
This is simple captive portal used by me in conjunction with my [AVR token generator](https://github.com/pamelus/avr-token-generator) for [OpenWRT](http://openwrt.org/). 
It provides user interface for token authentication and api controlling unit for avr-token-generator. Appropriate firewall rules are created automatically. Internet access is given per MAC address after successful token validation.

[![View demo video](https://img.youtube.com/vi/p0FRlCpmJHw/0.jpg)](https://www.youtube.com/watch?v=p0FRlCpmJHw)

## Running captive portal on OpenWRT
You need to configure your OpenWRT a bit to make magic happen. This guide assumes that you have already [configured a guest WLAN on your device](https://wiki.openwrt.org/doc/recipes/guest-wlan-webinterface).

Once you gave your guest WLAN and firewall zone (`guest`) prepare it to use with captive portal.

1. Disable forwarding from `guest` zone to `wan` zone in general firewall settings, to disable internet connection by default.
 
2. Enable forwarding for validated guests by adding new traffic rule:
	* Protocol: any
	* Source zone: guest
	* Destination zone: wan
	* Action: accept
	* Extra arguments: `-m mark --mark 0x2/0xf`
	
3. Disable password protection (`Encryption: No Encryption` in "Wireless Security" tab), so everyone will be able to connect and see captive portal.

4. Add custom firewall rules required by captive portal. You will need to install `iptables-mod-extra` if you have not do so yet.
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

	```
	
5. Upload `lua-captive-portal` to some path on your router (eg. `/captive`). Install captive portal requirements:

    ```
    opkg update
    opkg install libsqlite3 luasql-sqlite3
    ```

6. Create uhttpd configuration like this:
	```text
	config uhttpd 'auth'
    	option home '/captive/public_html'
		option cgi_prefix '/cgi-bin'
		option rfc1918_filter '0'
		option max_requests '3'
		option max_connections '100'
		option script_timeout '60'
		option network_timeout '30'
		option http_keepalive '20'
		option tcp_keepalive '1'
		option key 'PATH_TO_SSL_KEY'
		option cert 'PATH_TO_SSL_CERT'
		option listen_https 'ROUTER_IP:443'
		option error_page '/error404.html'
    
    config uhttpd 'auth_gateway'
		option home '/captive/gateway'
		option rfc1918_filter '0'
		option max_requests '3'
		option max_connections '100'
		option script_timeout '60'
		option http_keepalive '20'
		option tcp_keepalive '1'
		option key 'PATH_TO_SSL_KEY'
		option cert 'PATH_TO_SSL_CERT'
		option listen_https '1043'
		option listen_http '1080'
		option error_page '/index.html'
	```
	
	And restart uhttpd by `/etc/init.d/uhttpd restart`
	
7. Link & enable init script that validates guest and restores sessions upon boot.

```bash
	ln -s /etc/init.d/captive /captive/devops/init.d/captive
	/etc/init.d/captive enable
	/etc/init.d/captive start
```  
	
If everything went good you should now see captive portal working once you connect to your guest WiFi network. To create
token you can use `/etc/init.d/captive token` or build a [token generator](https://github.com/pamelus/avr-token-generator). To list
active sessions use `/etc/init.d/captive list`.
	
## Development requirements
All you need is text editor and latest docker compose. You can deploy application locally by simply:
```bash
docker-compose up
```

Docker container binds localhost port 80 to lua CGI application, so simply go to `http://localhost` to see portal working.

If you want to build frontend you will also need node.js and yarn / npm. For production build use:
```bash
cd frontend
yarn install
yarn build
```

For development you may want to enable continuous compilation with source maps. Enable it like this:
```bash
cd frontend
yarn install
yarn watch
```
