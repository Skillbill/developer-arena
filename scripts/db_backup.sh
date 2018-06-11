#!/bin/sh

set -ex

user=${DBUSER:-'postgres'}
database=${DATABASE:-'developer-arena'}
bckdir=${BACKUPDIR:-/var/backups}

ts=`date -u +%s`
docker_id=`docker ps | grep developer-arena-db | awk '{print $1}'`
backup="${bckdir}/${database}.sql.gz"

docker exec $docker_id \
       pg_dumpall -c --inserts -U $user -l $database | gzip > $backup.${ts}
