#!/bin/bash

set -e

CLIENT_ID_ENV_VAR=${FRIENDSDRINKS_CLIENT_ID}
USER_POOL_ID_ENV_VAR=${FRIENDSDRINKS_USER_POOL_ID}
if [ -z "$CLIENT_ID_ENV_VAR" ]
then
      echo "\$CLIENT_ID_ENV_VAR is empty"
      exit 1
fi

if [ -z "$USER_POOL_ID_ENV_VAR" ]
then
      echo "\$USER_POOL_ID_ENV_VAR is empty"
      exit 1
fi

echo "Successfully found environment variables. CLIENT_ID_ENV_VAR: ${CLIENT_ID_ENV_VAR}. FRIENDSDRINKS_USER_POOL_ID: ${FRIENDSDRINKS_USER_POOL_ID}"

kubectl create secret generic aws-cognito-configs --from-literal=clientid=${CLIENT_ID_ENV_VAR} \
--from-literal=userpoolid=${FRIENDSDRINKS_USER_POOL_ID}

