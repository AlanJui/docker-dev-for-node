FROM    node:8.6.0
EXPOSE  3000
EXPOSE  5858
COPY    . /app
WORKDIR /app

RUN     cd /app; npm install
CMD     ["npm", "start"]
