#!/bin/bash

# database migrations
python3 manage.py migrate

# Default admin user for DB (based on .env)
python3 manage.py create_default_admin 

# Db population with data
python3 manage.py loaddata db.json

# Start server
python3 manage.py runserver 0.0.0.0:8000