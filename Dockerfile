FROM    node:8.6.0
EXPOSE  3000
EXPOSE  5858
COPY    . /app
WORKDIR /app

#RUN     cd /app; npm install npm@5.6.0 -g; npm install
RUN     cd /app; npm install
CMD     ["npm", "start"]
