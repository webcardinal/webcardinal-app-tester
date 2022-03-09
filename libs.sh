#!/bin/sh

# Give permission to the following script
# chmod a+rx

cd libs/zxing-wrapper
rm -rf .git
git init
git remote add origin https://github.com/webcardinal/zxing-wrapper
git fetch origin && git reset --mixed origin/master && git clean -f -d

echo "zxing-wrapper fetched from origin"