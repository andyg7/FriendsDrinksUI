#!/usr/bin/env bash

set -eu

action=$1

kubectl $action -f kubernetes/10config.yml
kubectl $action -f kubernetes/10secret.yml

apply_tmp=$(mktemp)
./kubernetes/generate_manifest.sh kubernetes/21app.yml andyg001/friendsdrinksui:latest apply_tmp
kubectl $action -f apply_tmp

apply_tmp=$(mktemp)
./kubernetes/generate_manifest.sh kubernetes/20service.yml andyg001/friendsdrinksui:latest apply_tmp
kubectl $action -f apply_tmp

rm -rf apply_tmp

echo 'Success!'
