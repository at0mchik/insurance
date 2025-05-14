#!/bin/sh

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until PGPASSWORD=$DB_PASSWORD psql -h "$host" -p "$port" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing migrations"

for file in /app/migrations/*.up.sql; do
  >&2 echo "Applying migration: $file"
  PGPASSWORD=$DB_PASSWORD psql -h "$host" -p "$port" -U "$DB_USER" -d "$DB_NAME" -f "$file"
done

exec $cmd