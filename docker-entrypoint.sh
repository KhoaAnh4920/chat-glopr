#!/bin/sh
set -e

### Start app

pm2 start ts-node -n api -i 2 --log-date-format 'YYYY-MM-DD HH:mm:ss.SSS' -- -r tsconfig-paths/register src/main.ts

pm2 log

exec "$@"
