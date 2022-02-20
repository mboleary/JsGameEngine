#!/bin/bash

echo "POST /api/rooms"

curl -X POST -H "Content-Type: application/json" -d "$2" http://$1/api/rooms | jq
