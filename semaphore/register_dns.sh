#!/bin/bash

set -eu

stage=$1
region=$2
file=$3

domainNameToRegister="${stage}.friendsdrinks.com"
echo "Domain name to register ${domainNameToRegister}"
domain=$(aws --region "$region" acm list-certificates --query 'CertificateSummaryList[].DomainName' --output text | grep "${stage}.friendsdrinks.com" || echo 'na')

if [ "$domain" = 'na' ]
then
      echo "About to attempt to register domain name ${domainNameToRegister}"
      certificateArn=$(aws --region "$region" acm request-certificate --domain-name "$domainNameToRegister" --validation-method DNS --query 'CertificateArn' --output text)
      echo "$certificateArn"
      sleep 5
      aws --region "$region" acm describe-certificate --certificate-arn "$certificateArn" --query 'Certificate.DomainValidationOptions[0].ResourceRecord' | tee "$file"
else
      echo "${domainNameToRegister} is already registered"
      echo 'na' > "$file"
      exit 0
fi

