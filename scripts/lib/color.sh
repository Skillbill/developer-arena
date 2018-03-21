# color.sh

if [ -t 0 ] && [ "$TERM" ] && [ "$TERM" != "dumb" ]; then
	_n='\e[39m'
	_r='\e[31m'
	_g='\e[32m'
	_y='\e[33m'
	_dim='\e[90m'
	_bold='\e[1m'
	_reset='\e[0m'
fi
