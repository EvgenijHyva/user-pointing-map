FROM python:3.9

RUN apt-get update && \
	apt-get install -y zsh &&\
	apt-get install -y libgdal-dev && \
	apt-get install -y libgeos-dev 

RUN	chsh -s /usr/bin/zsh root 
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

ENV SHELL="/bin/zsh"
ENV GDAL_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/libgdal.so
ENV GEOS_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/libgeos_c.so.1.17.1

COPY ./requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/geobackend

WORKDIR /app/geobackend

EXPOSE 8000

RUN chmod +x start_server.sh

ENV DATABASE_HOST 172.17.0.2

CMD [ "./start_server.sh" ]