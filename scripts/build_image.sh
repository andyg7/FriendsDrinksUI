#!/bin/bash

docker build -t andyg001/friendsdrinksfrontend:$(date -u +"%Y%m%dT%H%M%SZ") .

