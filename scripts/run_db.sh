#!/bin/sh
#
# sda-contest DB launcher
#

#set -x
set -fC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/def.sh"
. "$LIB/fns.sh"

root="$LIB/../../"
img="$DOCKER_IMG_DB"
storage_path=/var/lib/postgresql/data

usage() {
	echo "usage: $CMD [-B | -P] [-t tag] [-l port] [-b path] [-u user] [-i | -p passwd]"
}

help() {
	usage
	cat <<EOF

Start the database

    -B			call docker build first
    -P			call docker pull first

    -t TAG		docker tag (default: $TAG)
    -l PORT		listen port (default: $DB_PORT)
    -b PATH		path to bind to $storage_path
    -u USER		db user (default: $DB_USER)
    -p PASSWORD 	db password (default: $DB_PASSWD)
    -i		        read db password from stdin
    -h			print this help end exit
EOF
}

while getopts BPt:l:b:u:p:ih arg; do
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
		b)
			path="$OPTARG"
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
listen=${listen:-$DB_PORT}
user=${user:-$DB_USER}
passwd=${passwd:-$DB_PASSWD}

if [ "$path" ]; then
	bind_args="-v ${path}:${storage_path}"
else
	warn "database is starting in ephemeral mode, use -b to bind a volume"
fi

echo "docker: ${img}:${tag}"
echo "user: ${user}"
echo "permanent storage: ${path:-NONE}"

if [ $interactive ]; then
	read_passwd "${user}" passwd
fi

if [ $build ]; then
	docker_build -t $DOCKER_IMG_DB "$root/db/" || exit 1
elif [ $pull ]; then
        img=${DOCKER_IMG_NS}/${img}
	docker_pull ${img}:${TAG} || exit 1
fi

docker_run -p ${listen}:${DB_PORT} ${bind_args} \
	   -e POSTGRES_USER=$user	\
	   -e POSTGRES_PASSWORD=$passwd	\
	   ${img}:${tag}
