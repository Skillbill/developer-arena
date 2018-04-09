#!/usr/bin/env bash

#set -x

docker_ps() {
    docker ps --format '{{.ID}} {{.Image}} {{.Names}}'
}

which="$1"
(
    if [ -z $which ]; then
	docker_ps | awk '$2 ~ /sda-contest-/ {print}' | xargs docker stop
    else
	docker_ps | awk '$3 == "'"$which"'" {print}'  | xargs docker stop
    fi
) 2>/dev/null
