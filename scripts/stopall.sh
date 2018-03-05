#!/bin/sh

for i in `docker ps | awk '$2 ~ /sda-contest-/ { print $1 }'`; do
    docker stop $i
done
