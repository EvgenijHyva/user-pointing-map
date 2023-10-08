# Backend

Backend requres packages installed in environment.
If environment is not installed then:

```bash
pip install virtualenv

virtualenv venv

source venv/bin/activate
```

### This is basic empty environment setup:

```bash
pip install -r requirements.txt
```

### For extracting dependencies as to <i>requirements.txt</i> run this:

```bash
pip freeze > requirements.txt
```

### App requires GDAL and GEOS i use homebrew for installation

```bash
brew install gdal geos
```

### After installation need to set the path for libraries in my case:

```bash
# GDAL Lib
export GDAL_LIBRARY_PATH=/home/linuxbrew/.linuxbrew/Cellar/gdal/3.7.2/lib/libgdal.so.33.3.7.2
# GEOS LIb
export GEOS_LIBRARY_PATH=/home/linuxbrew/.linuxbrew/Cellar/geos/3.12.0/lib/libgeos_c.so.1.18.0
```

# The Project require .env file backend folder

### Make sure this contain actual environment variables

```
# This is basic section for every django project
SECRET_KEY=<YOUR VALUE> # Secret key for Django
DEBUG=False # default True for dev

# Postgres Db settings
DATABASE_NAME=<YOUR VALUE>
DATABASE_USER=<YOUR VALUE>
DATABASE_PASSWORD=<YOUR VALUE>
DATABASE_HOST=<YOUR VALUE>
DATABASE_PORT=<YOUR VALUE>

# AppSettings
DJANGO_ADMIN_USERNAME=geoadmin
DJANGO_ADMIN_PASSWORD=Geodjango
DJANGO_ADMIN_EMAIL=admin@some.mail
```

# Docker Section

## For this project used database postgis/postgres that utilize the docker-image <i>postgis/postgis</i>.

### Docker command for creating and running the DB:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgis/postgis

# Find the IP of docker running postgre container
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' postgres
```

### Also the backned can be run in docker image the <i>Dockerfile</i> attached to backend.

```bash
# build
docker build -t geobackend:latest .

# inspect docker container, after stopping container it will dispose
docker run -it --rm geobackend /bin/zsh

# run container
docker run -d -p 8000:8000 --name geobackend app:latest
```
