FROM node:5-slim
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y
RUN apt-get install git -y

RUN npm install -g gulp
RUN mkdir /app
WORKDIR /app/

COPY package.json package.json
RUN npm install

COPY . /app/

RUN gulp build

EXPOSE 5000

CMD ["npm start"]
