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
	echo "usage: $CMD [-B | -P] [-t tag] [-l port] [-a host[:port]]"
}

help() {
	usage
	cat <<EOF

Start the frontend linked to the given backend

    -B			call docker build first
    -P			call docker pull first

    -t TAG		docker tag (default: $TAG)
    -l PORT		listen port (default: $FE_PORT)
    -a ADDRESS		backend address (default $BE_ADDR)
    -s                  use https (default: no)
    -h			print this help end exit
EOF
}

while getopts BPt:l:a:sh arg; do
	case $arg in
		B)
			build=1
			;;
		P)
			pull=1
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
		s)
		        proto=https
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
proto=${proto:-http}

echo "docker: ${img}:${tag}"
echo "backend: ${host}:${port}"

portscan $host $port || warn "backend unreachable"

if [ $build ]; then
	docker_build -t $DOCKER_IMG_FE "$root/fe/" || exit 1
elif [ $pull ]; then
        img=${DOCKER_IMG_NS}/${img}
        docker_pull ${img}:${tag} || exit 1
fi

docker_run -p ${listen}:${FE_PORT} \
       -e BE_PROTO=$proto \
       -e BE_HOST=$host	\
       -e BE_PORT=$port	\
       ${img}:${tag}
