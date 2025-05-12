FROM node:latest AS base

FROM base as dev
WORKDIR /code
COPY ./package*.json .
RUN npm i
COPY . .
ARG PORT
EXPOSE $PORT
CMD ["npm", "run", "dev"] 


FROM base as prod
WORKDIR /code
COPY ./package*.json .
RUN npm i
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"] 