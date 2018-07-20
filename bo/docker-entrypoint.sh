#!/bin/sh

if [ -n "$CONFIT_REPO_ID" ];then
    echo -n $CONFIT_REPO_ID >static/confitRepoId
fi

http-server -p 8081
