# Captive portal for LEDE written in LUA

## Overview
This is simple captive portal used by me in conjunction with my [AVR token generator](https://github.com/pamelus/avr-token-generator) for [LEDE](https://lede-project.org). 
It provides user interface for token authentication and api controlling unit for avr-token-generator. Appropriate firewall rules are created automatically. Internet access is given per MAC address after successful token validation.

## Running captive portal on LEDE
You need to configure your LEDE a bit to make magic happen. This guide assumes that you have already [configured a guest WLAN on your device](https://wiki.openwrt.org/doc/recipes/guest-wlan-webinterface).

Once you gave your guest WLAN and firewall zone (`guest`) prepare it to use with captive portal.

1. Disable forwarding from `guest` zone to `wan` zone in general firewall settings, to disable internet connection by default.
 
2. Enable forwarding for validated guests by adding creating new traffic rule:
	* Protocol: any
	* Source zone: guest
	* Destination zone: wan
	* Action: accept
	* Extra arguments: `-m mark --mark 0x2`
	
3. Disable password protection ("Encryption: No Encryption" in "Wireless Security" tab), so everyone will be able to connect and see captive portal.

4. Add custom firewall rules required by captive portal.
	```
	# Disable prerouting for validated guests
	iptables -t nat -A prerouting_guest_rule -m mark --mark 0x2 -j RETURN
	
	# Allow guests to display captive portal
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 443 -d ROUTER_IP -j RETURN
	
	# Redirect http traffic to gateway
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 80 -j REDIRECT --to-ports 1080
	iptables -t nat -A prerouting_guest_rule -p tcp --dport 443 -j REDIRECT --to-ports 1043
	
	# Create allowed guests chain
	iptables -t mangle -N allowed_guests
	iptables -t mangle -A PREROUTING -i guest -j allowed_guests

	```
	
5. Upload `lua-captive-portal` to some path on your router (eg. `/captive`).

6. Create uhttpd configuration like this:
	```
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
	
	If everything went good you should now see captive portal working once you connect to your guest WiFi network. To create
	token you can use `/captive/bin/mktoken` or build a [token generator](https://github.com/pamelus/avr-token-generator).
	
## Development requirements
All you need is text editor and latest docker compose. You can deploy application locally by simply:
```
docker-compose up
```

Docker container binds localhost port 80 to lua CGI application, so simply go to `http://localhost` to see portal working.

If you want to build frontend you will also need node.js and yarn / npm. For production build use:
```
cd frontend
yarn install
yarn build
```

For development you may want to enable continuous compilation with source maps. Enable it like this:
```
cd frontend
yarn install
yarn watch
```
