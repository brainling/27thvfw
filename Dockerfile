FROM node:5-slim

VOLUME["/app"]
ADD . /app
WORKDIR /app
CMD cd /app; npm install --dev; gulp build; npm start
