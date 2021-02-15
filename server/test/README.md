# Testing Scripts

This is a series of convenient scripts that are used to help test the rooms API.

## Usage

- `./GET.sh <URL>`
- `./GET_ONE.sh <URL> <ID>`
- `./POST.sh <URL> <JSON>`
    - Example JSON payload: `{"name":"Console Test"}`
- `./PUT.sh <URL> <ID> <JSON>`
- `./DELETE.sh <URL> <ID>`

## Requirements

- jq
- curl