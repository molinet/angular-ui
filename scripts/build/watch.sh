#!/usr/bin/env bash

# This script is intended to build a package in
# development mode and listen for live changes.
# Script arguments:
#   -p (required): Name of the package to build.

# Exit with nonzero exit code if anything fails
set -e

# Import config file
source "scripts/config.sh"

# Read arguments
while getopts "p:" opt; do
  case $opt in
    p) # package
      if [[ "${LIBRARY_PACKAGES[*]}" =~ $OPTARG ]]; then
        package=$OPTARG
      else
        echo -e "${COLOR_ERROR}(ERROR) Incorrect argument -p with value '$OPTARG'.\n"
        exit 0
      fi
    ;;
    \?)
      echo -e "${COLOR_ERROR}(ERROR) Invalid argument.\n"
      exit 0
    ;;
  esac
done

# Check that required argument is defined
if [ -z "$package" ]; then
  echo -e "${COLOR_ERROR}(ERROR) Missing argument -p for package.\n"
  exit 0
fi

# Delete package build directory
echo -e "Cleaning up package build directory...\n"
rm -rf dist/"$package"

# Build package in watch mode
echo -e "Building package ${COLOR_INFO}'$package'${COLOR_DEBUG} for development...\n"
ng build "$package" --watch --configuration development
