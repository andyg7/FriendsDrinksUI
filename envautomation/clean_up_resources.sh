#!/bin/zsh

set -eu

region=$1
cert_arn=$2

aws cloudformation --region $region delete-stack --stack-name CognitoResources
aws acm delete-certificate --certificate-arn "$cert_arn"