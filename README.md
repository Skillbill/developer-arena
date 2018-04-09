# sda-contest

![license](https://img.shields.io/github/license/mashape/apistatus.svg)

## Run the demo:

[![docker required](https://img.shields.io/badge/docker-required-green.svg)](https://www.docker.com/)

```
scripts/demo.sh
```

When you finished, shutdown the containers with:
```
scripts/stop.sh
```

## backend

### how to run
#### database:
```
scripts/run.sh -B db
````

#### api server:

##### dev mode:

[![nodejs required](https://img.shields.io/badge/nodejs-required-green.svg)](https://nodejs.org/)

```
cd be
npm install
node server.js
```

##### docker:
```
scripts/run.sh -B be
```

### api doc

[postman export of all apis](/doc/SDA-CONTEST.postman_collection.json)

## frontend

#### dev mode:

[![nodejs required](https://img.shields.io/badge/nodejs-required-green.svg)](https://nodejs.org/)

```
cd fe
npm install
npm run dev
```

##### docker:
```
scripts/run.sh -B fe
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
