FROM node:16-alpine

WORKDIR /usr/app

COPY . .

#ENV NODE_ENV production
RUN npm install
RUN npm run build

#ENV NODE_ENV production
ENV NODE_ENV ${NODE_ENV}
ENV PORT ${PORT}
ENV MONGO_URI ${MONGO_URI}

EXPOSE 3001

CMD ["npm", "start"]