#!/bin/bash

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    source "../venv/bin/activate"
    # Note can replace 127.0.0.1 with 0.0.0.0 to make it 'network/internet' accessable...
    # Note: NEED -k eventlet for this to work! I spent too many hours on this...
    gunicorn wsgi:app -b 127.0.0.1:8088 -k eventlet # <module>:<app>   IE <file>:<flask app variable>
}
main $@;
