#!/bin/zsh

# This script is intended to build all library
# packages for production purposes.
# Script arguments:
#   -v (required): Build version (in 'X.Y.Z' format).
#   -t (optional): Pre-release tag (accepted values: 'alpha', 'beta' or 'rc').
#   -i (optional): Iteration for the pre-release (number greater or equal than 0).

# Exit with nonzero exit code if anything fails
set -e

# Define build package function
buildPackage() {
  packageName=${1}
  version=${2}

  # Set temporary version in package.json
  gulp set-version --package="$packageName" --version="$version"

  echo -e "\nBuilding package $packageName@$version for production..."
  ng build "$packageName" --configuration production

  # Restore version in package.json
  gulp set-version --package="$packageName" --version=0.0.0
}

# Define library packages
PACKAGES=(
  "slideout-stack"
)

# Define valid pre-release tags
TAGS=(
  "alpha"
  "beta"
  "rc"
)

# Read arguments
while getopts "v:t:i:" opt; do
  case $opt in
    v) # version
      if [[ "$OPTARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        version="$OPTARG"
      else
        echo -e "\033[0;31m(BUILD ERROR) Incorrect argument -v with value '$OPTARG'. Does not match the semantic version number 'X.Y.Z'.\n"
        exit 0
      fi
    ;;
    t) # pre-release tag
      if [[ "${TAGS[*]}" =~ $OPTARG ]]; then
        tag=$OPTARG
      else
        echo -e "\033[0;31m(BUILD ERROR) Incorrect argument -t with value '$OPTARG'. Accepted values: 'alpha', 'beta' or 'rc'.\n"
        exit 0
      fi
    ;;
    i) # pre-release iteration
      if [[ "$OPTARG" =~ ^[0-9]+$ ]]; then
        iteration="$OPTARG"
      else
        echo -e "\033[0;31m(BUILD ERROR) Incorrect argument -i with value '$OPTARG'. Must be a number greater or equal than 0.\n"
        exit 0
      fi
    ;;
    \?)
      echo -e "\033[0;31m(BUILD ERROR) Invalid argument.\n"
      exit 0
    ;;
  esac
done

# Check that required argument is defined
if [ -z "$version" ]; then
  echo -e "\033[0;31m(BUILD ERROR) Missing argument -v for version.\n"
  exit 0
fi

# Check that other arguments are valid
if [ -n "$tag" ] && [ -n "$iteration" ]; then
  version=$version-$tag.$iteration
elif [ -n "$tag" ] && [ -z "$iteration" ]; then
  echo -e "\033[0;31m(BUILD ERROR) Pre-release tag defined but missing argument -i for iteration.\n"
  exit 0
elif [ -z "$tag" ] && [ -n "$iteration" ]; then
  echo -e "\033[0;31m(BUILD ERROR) Iteration defined but missing argument -t for pre-release tag.\n"
  exit 0
fi

# Delete dist directory
echo -e "\nCleaning up dist directory..."
rm -rf dist

# Build all packages
for packageName in "${PACKAGES[@]}"; do
  buildPackage "${packageName}" "$version"
done

# Build OK
echo -e "\nAll packages builded successfully."
