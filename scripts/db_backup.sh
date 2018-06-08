#!/bin/sh

set -ex

user=${DBUSER:-'postgres'}
database=${DATABASE:-'developer-arena'}
bckdir=${BACKUPDIR:-/var/backups}

ts=`date -u +%Y%m%d_%H%M%S`
docker_id=`docker ps | grep developer-arena-db | awk '{print $1}'`
backup="${bckdir}/${database}_${ts}.sql.gz"

docker exec $docker_id \
       pg_dumpall -c --inserts -U $user -l $database | gzip > $backup && echo created $backup
