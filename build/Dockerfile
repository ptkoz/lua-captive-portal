FROM gcc

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    lighttpd lua5.1 lua5.1-dev luarocks sqlite3 && \
    luarocks install luasql-sqlite3 && \
    rm -rf /var/lib/apt/lists/* && \
    useradd lighttpd

COPY config/*.conf /etc/lighttpd/

RUN mkdir -p /var/lib/sqlite && chown -R lighttpd:lighttpd /var/lib/sqlite

EXPOSE 80
VOLUME /var/www/localhost

ENTRYPOINT ["/usr/sbin/lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]