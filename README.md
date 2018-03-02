# sda-contest
## backend

### hot to run
#### database:
```
docker build -t sda-contest-db db/
docker run -p 5432:5432 sda-contest-db
````

#### backend:

##### dev mode:
```
npm install
node be/server.js
```

##### docker:
```
docker build -t sda-contest-be be/
docker run -p 3000:3000 sda-contest-be
```

### api doc

[postman export of all apis](/doc/SDA-CONTEST.postman_collection.json)

## frontend

##### docker:
```
docker build -t sda-contest-fe fe/
docker run -p 8080:8080 sda-contest-fe
```
