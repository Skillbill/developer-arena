# sda-contest

[![Automated by Buddy](https://assets.buddy.works/automated-blue.svg)](https://buddy.works) [![buddy pipeline](https://app.buddy.works/skillbill/sda-contest/pipelines/pipeline/133124/badge.svg?token=e2e206bc004d0c6e951d21b1626bb735ebd86eeb49d735368b5d053938f35e20 "buddy pipeline")](https://app.buddy.works/skillbill/sda-contest/pipelines/pipeline/133124)

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
npm start
```

##### docker:
```
scripts/run.sh -B be
```

### api doc

[postman export of all apis](/etc/postman/)

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

### fake auth middleware (dev mode)

By default, the backend will start in dev mode: any auth-required operation is accepted as long as the client sets the following HTTP header:

```
Authorization: $userid
```

### firebase auth middleware

In order to use the firebase authentication system, a service account must be provided in the [configuration file](be/config.json) and `devMode` has to be set to `false`

A client, in order to successfully perform an auth-required operation (like submit a project) must add to the HTTP request the following header:

```
Authorization: Bearer $token
```

where `$token` is a valid token obtained from firebase.

Accounts provisioned by email (that is, without an external provider), must verify their email first.
