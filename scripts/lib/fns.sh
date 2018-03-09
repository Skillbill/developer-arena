# fns.sh

. "$LIB/dat.sh"
. "$LIB/color.sh"

docker_run() {
	trace $docker $docker_run_args $@ || {
		err "docker run failed"
		return 1
	}
}

docker_build() {
	trace $docker $docker_build_args $@ || {
		err "docker build failed"
		return 1
	}
}

docker_pull() {
    trace $docker $docker_pull_args $@ || {
	err "docker pull failed"
	return 1
    }
}

trace() {
	(
		command=$@
		printf ${_dim}
		sh -x -c "$command"
		res=$?
		printf ${_reset}
		return $res
	)
}

_print() {
	printf "$1"
	shift
	echo -n $@
	printf "${_reset}\n"
}

msg() {
	echo
	_print "${_bold}  " "  $@"
	echo
}

warn() {
	_print "${_y}" "$CMD: $@" >&2
}

err() {
	_print "${_r}" "$CMD: $@" >&2
}

panic() {
	err "@"
	exit 1
}

split_addr() {
	eval "$2"=`echo $1 | awk -F: '{print $1}'`
	eval "$3"=`echo $1 | awk -F: '{print $2}'`
}

portscan() {
	$netcat -z ${host} ${port} 2>/dev/null
	case $? in
		127)    # command not found, ignore test
			return 0
			;;
		*)
			return $?
	esac
}

read_passwd() {
	echo -n "$1 password: "
	stty -echo
	read $2
	stty echo
	echo
}
