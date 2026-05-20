#!/bin/bash

# Ожидаем, когда Postgres поднимется
echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB} -h postgres -p 5432; do
  sleep 2
done
echo "PostgreSQL is ready!"

# Проверяем, пустая ли база
DB_EXISTS=$(PGPASSWORD=${POSTGRES_PASSWORD} psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -h postgres -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Domains');")

if [ "$DB_EXISTS" = "f" ]; then
    echo "Database is empty. Running seed models script..."
    node server_api/dist/utils/seedModels.js spinmoded@gmail.com vash_nadezhniy_parol_123
else
    echo "Database is not empty. Skipping seed models."
fi

echo "Starting application..."
exec "$@"