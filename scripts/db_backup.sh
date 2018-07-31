#!/bin/sh

set -ex

user=${DBUSER:-'postgres'}
database=${DATABASE:-'developer-arena'}
container=${CONTAINER:-'buddy_db'}
bckdir=${BACKUPDIR:-/var/backups}

ts=`date -u +%s`
docker_id=`docker ps | awk "/$container/"'{print $1}'`
backup="${bckdir}/${database}.sql.gz"

docker exec $docker_id \
       pg_dumpall -c --inserts -U $user -l $database | gzip > $backup.${ts}
