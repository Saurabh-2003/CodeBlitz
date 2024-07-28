#!/bin/sh

# Run Prisma database push
npx prisma db push

# Ensure the /code_execution directory has the correct permissions
chmod -R 777 /code_execution

# Execute the main command
exec "$@"
