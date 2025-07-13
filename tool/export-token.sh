#!/bin/sh

echo "Enter your GITHUB_NPM_TOKEN: \c"
stty -echo
read GITHUB_NPM_TOKEN
stty echo
echo

export GITHUB_NPM_TOKEN="$GITHUB_NPM_TOKEN"
echo "GITHUB_NPM_TOKEN이 현재 터미널에 설정되었습니다."