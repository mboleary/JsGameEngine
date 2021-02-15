#!/bin/bash

# https://unix.stackexchange.com/questions/79064/how-to-export-variables-from-a-file

ENV_FILE=".env"

set -a

source $ENV_FILE
# export $(cut -d= -f1 $ENV_FILE)
node index.js