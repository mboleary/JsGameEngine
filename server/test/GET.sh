#!/bin/bash

echo "GET /api/rooms"

curl http://$1/api/rooms | jq
