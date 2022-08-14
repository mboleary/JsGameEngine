#!/bin/bash

echo "PUT /api/rooms"

curl -X PUT -H "Content-Type: application/json" -d "$3" http://$1/api/rooms/$2 | jq
