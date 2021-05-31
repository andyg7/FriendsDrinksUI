#!/bin/zsh

set -eu

region=$1

aws cloudformation --region $region delete-stack --stack-name CognitoResources