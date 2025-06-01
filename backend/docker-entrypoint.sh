#!/bin/sh
# The '-e' flag causes the script to exit immediately if a command fails.
set -e

# 1. Run Prisma migrations
echo "--- Running Prisma migrations ---"
npx prisma migrate deploy

# 2. Start the application
# 'exec "$@"' runs the command passed to the script. In our case, this will be the CMD from the Dockerfile.
echo "--- Starting application ---"
exec "$@"