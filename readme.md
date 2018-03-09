# Backend Sel Project

## Install dependancies
`npm install`

## Install Docker:

```
wget https://get.docker.com/ -O script.sh
chmod +x script.sh
./script.sh
```

## MongoDB

### Interractive mode

```
sudo docker run --name mongoDB -p 27017:27017 -d mongo --auth
sudo docker start mongoDB
```

### Non interractive mode

```
sudo docker run --name mongoDB -p 27017:27017 mongo --auth
```

## Run it

```
npm start
```

