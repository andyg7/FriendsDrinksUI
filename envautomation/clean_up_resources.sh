#!/bin/zsh

set -eu

region=$1
cert_arn=$2

aws cloudformation --region $region delete-stack --stack-name CognitoResources
aws cloudformation --region $region delete-stack --stack-name DNSRecordSetStack
aws cloudformation --region $region delete-stack --stack-name CNAMERecordSetStack
aws acm delete-certificate --certificate-arn "$cert_arn"