FROM node:5-slim
ENV DEBIAN_FRONTEND noninteractive

RUN npm install -g gulp
RUN mkdir /app
WORKDIR /app/

COPY package.json package.json
RUN npm install --dev

COPY . /app/

RUN gulp build

EXPOSE 5000

CMD ["npm start"]
