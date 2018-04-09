#!/usr/bin/env bash
#
# sda-contest demo
#

set -efC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/fns.sh"

root="$LIB/../../"
cd $root

msg 'pulling and starting services'

scripts/run.sh -P -n host db
scripts/run.sh -P -n host be
scripts/run.sh -P -n host -l 8080 fe

msg "open demo at http://localhost:8080/"
