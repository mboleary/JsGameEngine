#!/bin/bash

echo "DELETE /api/rooms"

curl -X 'DELETE' http://$1/api/rooms/$2 | jq
