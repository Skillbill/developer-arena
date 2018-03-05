#!/bin/sh
#
# sda-contest FE launcher
#

#set -x
set -fC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/def.sh"
. "$LIB/fns.sh"

root="$LIB/../../"
img="$DOCKER_IMG_FE"

usage() {
	echo "usage: $CMD [-B] [-t tag] [-l port] [-a host[:port]]"
}

help() {
	usage
	cat <<EOF

Start the frontend linked to the given backend

    -B			call docker build first
    -t TAG		docker tag (default: $TAG)
    -l PORT		listen port (default: $FE_PORT)
    -a ADDRESS		backend address (default $BE_ADDR)
    -h			print this help end exit
EOF
}

while getopts Bt:l:a:h arg; do
	case $arg in
		B)
			build=1
			;;
		t)
			tag="$OPTARG"
			;;
		l)
			listen="$OPTARG"
			;;
		a)
			addr="$OPTARG"
			;;
		h)
			help
			exit 0
			;;
		'?')
			usage >&2
			exit 2
			;;
	esac
done

tag=${tag:-$TAG}
listen=${listen:-$FE_PORT}
addr=${addr:-$BE_ADDR}

split_addr $addr host port
port=${port:-$BE_PORT}

echo "docker: ${img}:${tag}"
echo "backend: ${host}:${port}"

portscan $host $port || warn "backend unreachable"

if [ $build ]; then
	docker_build -t $DOCKER_IMG_FE "$root/fe/" || exit 1
fi

docker_run -p ${listen}:${FE_PORT} \
       -e BE_HOST=$host	\
       -e BE_PORT=$port	\
       ${img}:${tag}
