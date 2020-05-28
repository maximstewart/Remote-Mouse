#!/bin/bash

# set -o xtrace       ## To debug scripts
# set -o errexit      ## To exit on error
# set -o errunset     ## To exit if a variable is referenced but not set


function main() {
    source "../venv/bin/activate"
    # Note can replace 127.0.0.1 with 0.0.0.0 to make it 'network/internet' accessable...
    gunicorn wsgi:app -b 127.0.0.1:8080 # <module>:<app>   IE <file>:<flask app variable>
}
main $@;
