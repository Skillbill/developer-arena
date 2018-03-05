#!/bin/sh
#
# sda-contest demo
#

set -efC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/def.sh"
. "$LIB/fns.sh"

root="$LIB/../../"

msg 'building docker images'

cd $root
docker_build -t $DOCKER_IMG_DB db/
docker_build -t $DOCKER_IMG_BE be/
docker_build -t $DOCKER_IMG_FE fe/

msg 'starting services'

for svc in db be fe; do
	scripts/run_${svc}.sh
done

msg "open demo at http://$FE_ADDR/"
