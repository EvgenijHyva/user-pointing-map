<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>

# User pointing map

### This application is created using tech stack:

- Django <i class="fab fa-python"></i>
- Django Rest Framework: <i class="fab fa-python"></i>
- React <i class="fab fa-react"></i> + TypeScript: <i class="fab fa-js"></i>
- Postgresql/postgis <i class="fas fa-database"></i> [Learn More](https://www.postgresql.org/)
- Docker 🐳
- [OpenLayers](https://openlayers.org/)
- [Material UI](https://mui.com/material-ui/)
- [Toastify](https://fkhadra.github.io/react-toastify/introduction/)

### Instructions for running project:

1. Backend -> [Link to Backend README](geobackend/README.MD)

2. Frontend -> [Link to Frontend README](frontend/README.md)

### OR you just can run docker-compose file it will do everything for you:

This will create 2 containers with DB and geobackend instance.

```bash
docker-compose up --build
# or just
docker-compose up
```

Sometimes you need to restart docker compose, because on initial state it try to run skripts against database and fail. After restart it should working.

### In case of problems

If you encounter any issues or problems while working with this project, consider the following

- 403 Forbiden ( while creating/updating/deleting points <i class="fas fa-map-marker-alt"></i> ) -> Clear Browser Cookies and Cache. In your web browser settings, clear your cookies, cache, and browsing history. Close and reopen your browser.
- Backend Docker / Docker Compose Issue: This issue likely stems from challenges with GDAL and GEOS paths within the container. This project was originally developed on Windows ( <i class="fab fa-windows"></i> ) with WSL, and on Mac (🍏), Docker uses a different builder, which may introduce variations in the environment.
