# fns.sh

. "$LIB/dat.sh"
. "$LIB/color.sh"

docker_run() {
	local args=$@
	trace "$docker $docker_run_args $args" || {
		err "docker run failed"
		return 1
	}
}

docker_build() {
	local args=$@
	trace "$docker $docker_build_args $args" || {
		err "docker build failed"
		return 1
	}
}

trace() {
	printf ${_dim}
	sh -x -c "$@"
	local r=$?
	printf ${_reset}
	return $r
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
