#!/usr/bin/env bash

# This script is intended to build all library
# packages for production purposes.
# Script arguments:
#   -v (required): Build version (in 'X.Y.Z' format).
#   -t (optional): Pre-release tag (accepted values: 'alpha', 'beta' or 'rc').
#   -i (optional): Iteration for the pre-release (number greater or equal than 0).

# Exit with nonzero exit code if anything fails
set -e

# Import config file
source "scripts/config.sh"

# Define build package function
buildPackage() {
  packageName=${1}
  version=${2}

  # Set temporary version in package.json
  gulp set-version --package="$packageName" --version="$version"

  echo -e "\nBuilding package ${COLOR_INFO}$packageName@$version${COLOR_DEBUG} for production...\n"
  ng build "$packageName" --configuration production

  # Restore version in package.json
  gulp set-version --package="$packageName" --version=0.0.0
}

# Read arguments
while getopts "v:t:i:" opt; do
  case $opt in
    v) # version
      if [[ "$OPTARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        version="$OPTARG"
      else
        echo -e "${COLOR_ERROR}(ERROR) Incorrect argument -v with value '$OPTARG'. Does not match the semantic version number 'X.Y.Z'.\n"
        exit 0
      fi
    ;;
    t) # pre-release tag
      if [[ "${PRERELEASE_TAGS[*]}" =~ $OPTARG ]]; then
        tag=$OPTARG
      else
        echo -e "${COLOR_ERROR}(ERROR) Incorrect argument -t with value '$OPTARG'. Accepted values: 'alpha', 'beta' or 'rc'.\n"
        exit 0
      fi
    ;;
    i) # pre-release iteration
      if [[ "$OPTARG" =~ ^[0-9]+$ ]]; then
        iteration="$OPTARG"
      else
        echo -e "${COLOR_ERROR}(ERROR) Incorrect argument -i with value '$OPTARG'. Must be a number greater or equal than 0.\n"
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
if [ -z "$version" ]; then
  echo -e "${COLOR_ERROR}(ERROR) Missing argument -v for version.\n"
  exit 0
fi

# Check that other arguments are valid
if [ -n "$tag" ] && [ -n "$iteration" ]; then
  version=$version-$tag.$iteration
elif [ -n "$tag" ] && [ -z "$iteration" ]; then
  echo -e "${COLOR_ERROR}(ERROR) Pre-release tag defined but missing argument -i for iteration.\n"
  exit 0
elif [ -z "$tag" ] && [ -n "$iteration" ]; then
  echo -e "${COLOR_ERROR}(ERROR) Iteration defined but missing argument -t for pre-release tag.\n"
  exit 0
fi

# Delete dist directory
echo -e "Cleaning up dist directory...\n"
rm -rf dist

# Build all packages
for packageName in "${LIBRARY_PACKAGES[@]}"; do
  buildPackage "${packageName}" "$version"
done

# Build OK
echo -e "\n${COLOR_SUCCESS}All packages built successfully.${COLOR_DEBUG}"
