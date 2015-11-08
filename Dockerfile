FROM node:5-slim
MAINTAINER Matt Holmes <matt@holmescode.com>

ENV DEBIAN_FRONTEND noninteractive

VOLUME ["/app"]
ADD . /app
WORKDIR /app
CMD cd /app; npm install --dev; gulp build; npm start
