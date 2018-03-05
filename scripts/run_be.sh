#!/bin/sh
#
# sda-contest BE launcher
#

#set -x
set -fC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/def.sh"
. "$LIB/fns.sh"

root="$LIB/../../"
img="$DOCKER_IMG_BE"

usage() {
	echo "usage: $CMD [-B] [-t tag] [-l port] [-a host[:port]] [-u user] [-i | -p passwd]"
}

help() {
	usage
	cat <<EOF

Start the backend linked to the given database

    -B			call docker build first
    -t TAG		docker tag (default: $TAG)
    -l PORT		listen port (default: $BE_PORT)
    -a ADDRESS		database address (default $DB_ADDR)
    -u USER		db user (default: $DB_USER)
    -p PASSWORD 	db password (default: $DB_PASSWD)
    -i		        read db password from stdin
    -h			print this help end exit
EOF
}

while getopts Bt:l:a:u:p:ih arg; do
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
		u)
			user="$OPTARG"
			;;
		p)
			passwd="$OPTARG"
			;;
		i)
			interactive=1
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
listen=${listen:-$BE_PORT}
addr=${addr:-$DB_ADDR}
user=${user:-$DB_USER}
passwd=${passwd:-$DB_PASSWD}

split_addr $addr host port
port=${port:-$DB_PORT}

echo "docker: ${img}:${tag}"
echo "db user: $user"
echo "db addr: ${host}:${port}"

portscan $host $port || warn "database is unreachable"

if [ $interactive ]; then
	read_passwd "${user}@${host}:${port}" passwd
fi

if [ $build ]; then
	docker_build -t $DOCKER_IMG_BE "$root/be/" || exit 1
fi

docker_run -p ${listen}:${BE_PORT} \
	-e DB_HOST=$host	\
	-e DB_PORT=$port	\
	-e DB_USER=$user	\
	-e DB_PASSWD=$passwd	\
	${img}:${tag}
