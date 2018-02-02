FROM    node:4.7.0
EXPOSE  3000
EXPOSE  5858
COPY    . /app
WORKDIR /app

RUN     cd /app; npm install npm@5.6.0 -g; npm install
CMD     ["node", "app.js"]
