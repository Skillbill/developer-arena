#!/usr/bin/env bash
#
# sda-contest demo
#

set -efC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/def.sh"
. "$LIB/fns.sh"

root="$LIB/../../"

cd $root

msg 'pulling and starting services'

for svc in db be fe; do
	scripts/run_${svc}.sh -P
done

msg "open demo at http://$FE_ADDR/"
