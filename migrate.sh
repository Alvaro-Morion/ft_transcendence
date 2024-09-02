#!/bin/sh

postgres_ready() {
    python << END
import sys
import os

from psycopg import connect
from psycopg.errors import OperationalError

try:
    connect(
        dbname= os.getenv("POSTGRES_DB"),
        user= os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host= os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT")
    )
except OperationalError:
    sys.exit(-1)
END
}
echo "Waiting for postgres..."

until postgres_ready
do
    sleep 0.1
done

echo "database connected"

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000