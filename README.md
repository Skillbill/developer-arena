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
cd be
npm install
node server.js
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
cd fe
npm install
npm run dev
```

##### docker:
```
scripts/run_fe.sh -B
```

## Authentication

### firebase auth middleware

firebase authentication is implemented in [be/lib/auth.js](be/lib/auth.js); it is automatically enabled at the backend init time if a valid service account key is found in ``be/keys/firebase.json``

A client, in order to successfully perform an auth-required operation (like submit a project) must add to the HTTP request the following header:

```
Authorization: Bearer $token
```

where `$token` is a valid token obtained from firebase.

Accounts provisioned by email (that is, without an external provider), must verify their email first.

### fake auth middleware (dev mode)

If no firebase key is provided, the backend will proceed in dev mode: any auth-required operation is accepted as long as the client sets the following HTTP header:

```
Authorization: $userid
```
