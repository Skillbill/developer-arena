#!/bin/sh

set -e
exec 1>&2

(cd be && npm run lint)

# If there are whitespace errors, print the offending file names and fail.
git diff-index --check --cached HEAD --
