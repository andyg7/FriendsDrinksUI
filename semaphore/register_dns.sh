#!/bin/zsh

set -eu

aws sts get-caller-identity

stage=$1
region=$2

domainNameToRegister="${stage}.friendsdrinks.com"
echo "Domain name to register ${domainNameToRegister}"
domain=$(aws --region "$region" acm list-certificates --query 'CertificateSummaryList[].DomainName' --output text | grep "${stage}.friendsdrinks.com" || echo 'na')
echo 'bye'

if [ "$domain" = 'na' ]
then
      echo "About to attempt to register domain name ${domainNameToRegister}"
      aws --region $region acm request-certificate --domain-name "$domainNameToRegister" --validation-method DNS
else
      echo "${domainNameToRegister} is already registered"
      exit 0
fi

