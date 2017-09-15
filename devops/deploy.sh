#!/usr/bin/env bash


SOURCE=$( greadlink -f "$(dirname "$0")/.." )
TARGET="root@wro.tuxlan.es:/mnt/sda1/auth.wro.tuxlan.es"

rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/backend" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/bin" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/gateway" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "${SOURCE}/public_html" "${TARGET}/"
rsync -rlpt --progress --exclude='.git*' --exclude='deploy.sh' --filter="dir-merge,- .gitignore" "${SOURCE}/devops" "${TARGET}/"