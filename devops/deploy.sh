#!/usr/bin/env bash

if [[ "$1" == "" ]]; then
	echo "Usage: $0 TARGET AUTH_DOMAIN"
	echo ""
	echo "Example:"
	echo "    $0 10.0.0.1"
	echo "    $0 10.0.0.1 sample.com"
	echo "    $0 root@10.0.0.1"
	echo "    $0 root@10.0.0.1 sample.com"
	echo "    $0 root@10.0.0.1:/captive"
	echo "    $0 root@10.0.0.1:/captive sample.com"
	exit 1;
fi

TARGET="${1}"
if [[ ${TARGET} =~ ":" ]]; then
	TARGET_AUTH=$(echo ${TARGET} | cut -d ":" -f 1)
	TARGET_PATH=$(echo ${TARGET} | cut -d ":" -f 2)
else
	TARGET_PATH="/mnt/ext/auth"
	TARGET_AUTH="${TARGET}"
fi
if [[ ${TARGET_AUTH} =~ "@" ]]; then
	TARGET_USER=$(echo ${TARGET_AUTH} | cut -d "@" -f 1)
	TARGET_HOST=$(echo ${TARGET_AUTH} | cut -d "@" -f 2)
else
	TARGET_USER="root"
	TARGET_HOST="${TARGET_AUTH}"
fi
TARGET_AUTH="${TARGET_USER}@${TARGET_HOST}"
TARGET="${TARGET_AUTH}:${TARGET_PATH}"

DOMAIN="${2}"
if [[ "$2" == "" ]]; then
	DOMAIN="${TARGET_HOST}"
fi
SOURCE=$( realpath "$( dirname $(realpath "$0") )/.." )

rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/backend" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/bin" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/gateway" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/public_html" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --exclude='deploy.sh' --filter="dir-merge,- .gitignore" "${SOURCE}/devops" "${TARGET}/"
ssh ${TARGET_AUTH} sed -ie "s/{DOMAIN}/${DOMAIN}/" ${TARGET_PATH}/gateway/index.html
