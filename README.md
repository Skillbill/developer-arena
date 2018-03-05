# sda-contest

## Run the demo:
```
scripts/demo.sh
```

When you finished, shutdown the containers with:
```
scripts/stopall.sh
```

## backend

### how to run
#### database:
```
scripts/run_db.sh -B
````

#### api server:

##### dev mode:
```
npm install
node be/server.js
```

##### docker:
```
scripts/run_be.sh -B
```

### api doc

[postman export of all apis](/doc/SDA-CONTEST.postman_collection.json)

## frontend

#### dev mode:
```
npm install
npm run dev
```

##### docker:
```
scripts/run_fe.sh -B
```
