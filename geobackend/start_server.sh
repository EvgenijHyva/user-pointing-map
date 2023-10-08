#!/bin/bash

# database migrations
python3 manage.py migrate

# Start server
python3 manage.py runserver 0.0.0.0:8000