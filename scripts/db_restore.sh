#!/bin/sh

set -ex

user=${DBUSER:-'postgres'}
database=${DATABASE:-'developer-arena'}
dump=$1

if [ -z "$1" ]; then
    echo 'no dump specified' >&2
    exit 1
fi

docker_id=`docker ps | grep developer-arena-db | awk '{print $1}'`
gzip -d < $dump | docker exec -i $docker_id psql -U $user
