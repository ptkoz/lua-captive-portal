#!/usr/bin/env bash

if [[ "$1" == "" ]]; then
	echo "Usage: $0 TARGET"
	echo ""
	echo "Example:"
	echo "    $0 root@10.0.0.1:/captive"
	exit 1;
fi

TARGET="${1}"
SOURCE="$( dirname "$0")"

scp -r "${SOURCE}/src" "${TARGET}"
scp -r "${SOURCE}/bin" "${TARGET}"
scp -r "${SOURCE}/public_html" "${TARGET}"
scp -r "${SOURCE}/init.d" "${TARGET}"
