map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

upstream websocket {
    server 127.0.0.1:8010;
}

server {

    listen 8000;
    server_name test1.com;
    root /home/vagrant/bekindred/bekindred/static/;

    client_max_body_size 4G;

    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    access_log      /var/log/nginx/test1.com.access.log combined;
    error_log       /var/log/nginx/test1.com.error.log warn;

    location /socket.io/ {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
    proxy_read_timeout 1000;
    }
    location /static/ {
        alias   /home/vagrant/bekindred/bekindred/static/;
        access_log   off;
        add_header Access-Control-Allow-Origin *;
        expires      30d;
    }

    location /media/ {
        alias   /home/vagrant/bekindred/bekindred/media/;
        add_header X-Static hit;
    }

    location / {

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_set_header Host $http_host;


        if ($http_origin ~* (https?://.*\.test1\.com(:[0-9]+)?)) {
            set $cors "true";
        }


        if ($request_method = 'OPTIONS') {
            set $cors "${cors}options";
        }

        if ($request_method = 'GET') {
            set $cors "${cors}get";
        }
        if ($request_method = 'POST') {
            set $cors "${cors}post";
        }

        if ($cors = "trueget") {
            add_header 'Access-Control-Allow-Origin' "$http_origin";

            add_header 'Access-Control-Allow-Credentials' 'true';

        }

        if ($cors = "truepost") {

            add_header 'Access-Control-Allow-Origin' "$http_origin";

            add_header 'Access-Control-Allow-Credentials' 'true';

        }

        if ($cors = "trueoptions") {
            add_header 'Access-Control-Allow-Origin' "$http_origin";
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since';
            add_header 'Content-Length' 0;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            return 204;
        }

        if (!-f $request_filename) {
            proxy_pass http://127.0.0.1:8888;
            add_header X-Static miss;
      break;
        }
    }

    # Error pages
    error_page 500 502 503 504 /500.html;
    location = /500.html {
        root /home/vagrant/bekindred/bekindred/static;
    }
}
