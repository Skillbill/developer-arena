#!/bin/sh

if [ -n "$CONFIT_REPOID" ];then
    echo -n $CONFIT_REPOID >static/confitRepoId
fi

http-server
