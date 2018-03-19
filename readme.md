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
sudo docker run --name mongoDB -p 27017:27017 -d mongo
sudo docker start mongoDB
```

### Non interractive mode

```
sudo docker run --name mongoDB -p 27017:27017 mongo
```

## Run it

```
npm start
```

## Build docker image

```
docker build -t sel/sel-api .
```

### Run docker image

```
docker run -p 49160:8080 -d sel/sel-api
```