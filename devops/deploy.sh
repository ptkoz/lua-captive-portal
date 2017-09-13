#!/usr/bin/env bash


SOURCE=$( greadlink -f "$(dirname "$0")/.." )
TARGET="root@wro.tuxlan.es:/mnt/sda1/auth.wro.tuxlan.es"

rsync -rlpt --progress --exclude='.git*' --filter="dir-merge,- .gitignore" "$SOURCE/" "$TARGET/"