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
    trap 'echo -ne ${_reset}' RETURN
    local command=$@
    echo -ne ${_dim}
    sh -x -c "$command"
}

_print() {
	echo -ne "$1"
	shift
	echo -n $@
	echo -ne "${_reset}\n"
}

msg() {
	_print "${_bold}  " "  $@"
}

warn() {
	_print "${_y}" "$CMD: $@" >&2
}

err() {
	_print "${_r}" "$CMD: $@" >&2
}

panic() {
	err "$@"
	exit 1
}

vmap() {
    printf -- '-v %s:%s' "$(realpath "$1")" "$2"
}
