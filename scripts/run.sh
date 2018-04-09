#!/usr/bin/env bash
#

#set -x
set -fC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/fns.sh"

root="$LIB/../../"

tag=${TAG:-latest}
docker_img_ns=${DOCKER_IMG_NS:-skillbillsrl}
DOCKER_IMG_FE=${DOCKER_IMG_FE:-sda-contest-fe}
FE_PORT=8080
DOCKER_IMG_BE=${DOCKER_IMG_BE:-sda-contest-be}
BE_PORT=3000
DOCKER_IMG_BO=${DOCKER_IMG_BO:-sda-contest-bo}
BO_PORT=8080
DOCKER_IMG_DB=${DOCKER_IMG_DB:-sda-contest-db}
DB_PORT=5432

usage() {
	echo "usage: $CMD [-B|-P] [-t tag] [-n net] [-l port] [-c file] service"
}

help() {
	usage
	cat <<EOF

Start service with the given settings

    -B			call docker build first
    -P			call docker pull first
    -f			run container in foreground

    -t TAG		docker tag (default: $tag)
    -n NETWORK		docker network (default: docker default)
    -c FILE		configuration file (default: none)
    -l PORT		exposed listen port
    -h			print this help end exit
EOF
}

while getopts BPft:n:c:l:h arg; do
	case $arg in
		B)
			build=1
			;;
		P)
			pull=1
			;;
		f)
		        fg=1
			;;
		t)
			tag="$OPTARG"
			;;
		n)
			network="$OPTARG"
			;;
		c)
			cfgpath="$OPTARG"
			;;
		l)
			listen="$OPTARG"
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

let OPTIND=$OPTIND-1
shift $OPTIND
svc=$1
case $svc in
    fe)
	img=$DOCKER_IMG_FE
	bindto=/app/static/configuration.js:ro
	svclisten=$FE_PORT
	;;
    be)
	img=$DOCKER_IMG_BE
	bindto=/be/config.js:ro
	svclisten=$BE_PORT

	;;
    bo)
	svc=bo
	img=$DOCKER_IMG_BO
	bindto=/app/static/configuration.json:ro
	svclisten=$BO_PORT
	;;
    db)
	img=$DOCKER_IMG_DB
	bindto=/var/lib/postgresql/data
	svclisten=$DB_PORT
	;;
    '')
	usage >&2
	exit 2
	;;
    *)
	panic "unknown service: $svc"
esac

listen=${listen:-$svclisten}

if [ $build ]; then
	docker_build -t $img "$root/$svc/" || exit 1
elif [ $pull ]; then
        img=${docker_img_ns}/${img}
	docker_pull ${img}:${tag} || exit 1
fi

if [ "$cfgpath" ]; then
    if [ ! -r "$cfgpath" ]; then
	panic "could not access to $cfgpath: file does not exist or is not readable"
    fi
    if [ -d "$cfgpath" ]; then
	panic "config file must be a file, not a directory"
    fi
    if [ $svc == "db" ]; then
	. $cfgpath
	env_cfg=$(printf -- '-e POSTGRES_USER="%s" -e POSTGRES_PASSWORD="%s"' $db_user $db_passwd)
	if [ ! -z $db_storage_path ]; then
	    map_cfg=$(vmap "$db_storage_path" "$bindto")
	fi
    else
	map_cfg=$(vmap "$cfgpath" "$bindto")
    fi
else
    cfgpath="(defaults)"
fi

if [ "$network" ]; then
    net_cfg="--net $network"
else
    network="(docker default)"
fi

if [ -z "$fg" ]; then
    opts="-d"
fi

msg "docker:  ${img}:${tag}"
msg "network: ${network}"
msg "ports:   ${listen}:${svclisten}"
msg "config:  ${cfgpath}"

if [ $svc == db ]; then
    if [ -z $db_storage_path ]; then
	warn "database is starting in ephemeral mode"
    else
	msg "storage:  ${db_storage_path}"
    fi
fi

docker_run ${opts} --name $svc -p ${listen}:${svclisten} ${net_cfg} ${map_cfg} ${env_cfg} ${img}:${tag}
