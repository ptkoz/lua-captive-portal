#!/usr/bin/env bash

if [[ "$1" == "" ]]; then
	echo "Usage: $0 TARGET"
	echo ""
	echo "Example:"
	echo "    $0 root@10.0.0.1:/captive"
	exit 1;
fi

TARGET="${1}"
SOURCE=$( realpath "$( dirname $(realpath "$0") )/.." )

rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/backend" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/bin" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/gateway" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/public_html" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --exclude='deploy.sh' --filter="dir-merge,- .gitignore" "${SOURCE}/devops" "${TARGET}/"
ssh ${TARGET_AUTH} sed -ie "s/{DOMAIN}/${DOMAIN}/" ${TARGET_PATH}/gateway/index.html
