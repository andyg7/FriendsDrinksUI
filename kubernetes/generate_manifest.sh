#!/usr/bin/env bash

set -eu

export manifest=$1
export img=$2
export serviceType=$3
export apply_tmp=$4

cat $manifest | envsubst | tee $apply_tmp