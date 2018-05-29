#!/usr/bin/env bash
#

#set -x
set -fC

CMD=`basename $0`
LIB=`dirname $0`/lib
. "$LIB/fns.sh"

root="$LIB/../../"

tag=${TAG:-latest}
network=${DOCKER_NETWORK:-host}
namespace=${DOCKER_NAMESPACE:-skillbillsrl}
img_fe=${DOCKER_IMG_FE:-developer-arena-fe}
img_be=${DOCKER_IMG_BE:-developer-arena-be}
img_bo=${DOCKER_IMG_BO:-developer-arena-bo}
img_db=${DOCKER_IMG_DB:-developer-arena-db}

fe_port=8080
be_port=3000
bo_port=8081
db_port=5432

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
    -n NETWORK		docker network (default: $docker_network)
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
	img=$img_fe
	bindto=/app/static/configuration.json:ro
	svclisten=$fe_port
	;;
    be)
	img=$img_be
	bindto=/be/config.json:ro
	svclisten=$be_port
	;;
    bo)
	img=$img_bo
	bindto=/app/static/configuration.json:ro
	svclisten=$bo_port
	;;
    db)
	img=$img_db
	bindto=/var/lib/postgresql/data
	svclisten=$db_port
	;;
    '')
	usage >&2
	exit 2
	;;
    *)
	panic "unknown service: $svc"
esac

if [ "$listen" ] && [ "$network" == "host" ]; then
    warn "-l argument is not effective in host mode"
fi

listen=${listen:-$svclisten}

if [ $build ]; then
	docker_build -t $img "$root/$svc/" || exit 1
elif [ $pull ]; then
        img=${namespace}/${img}
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

docker_run ${opts} --net ${network} --name $svc -p ${listen}:${svclisten} ${map_cfg} ${env_cfg} ${img}:${tag}
