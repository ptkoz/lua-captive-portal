#!/usr/bin/env bash

if [[ "$1" == "" ]] || [[ "$2" == "" ]]; then
	echo "Usage: $0 TARGET_HOST AUTH_DOMAIN"
	exit 1;
fi

SOURCE=$( readlink -f "$(dirname "$0")/.." )
TARGET_HOST="${1}"
TARGET="root@${TARGET_HOST}:/mnt/ext/auth"
DOMAIN="${2}"

rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/backend" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/bin" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/gateway" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/public_html" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --exclude='deploy.sh' --filter="dir-merge,- .gitignore" "${SOURCE}/devops" "${TARGET}/"
ssh root@${TARGET_HOST} sed -ie "s/{DOMAIN}/${DOMAIN}/" /mnt/ext/auth/gateway/index.html