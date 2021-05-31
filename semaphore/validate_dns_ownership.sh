#!/bin/bash

set -eu

cname_file=$1

record_set=$(cat $cname_file)


if [ "$record_set" = 'na' ]
then
  exit 0
else
  name=$(cat $cname_file | jq -r '.Name')
  echo "Name is ${name}"
  value=$(cat $cname_file | jq -r '.Value')
  echo "Value is ${value}"
  aws cloudformation validate-template --template-body file://cloudformation/dns/cname.yml
  aws cloudformation deploy --template-file cloudformation/dns/cname.yml --stack-name CNAMERecordSetStack --parameter-overrides CNAMERecordValue="$value" CNAMERecordName="$name" HostedZoneId=Z03368065P2HEQ3Z6RIO Stage=beta
fi
