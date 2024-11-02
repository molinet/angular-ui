#!/bin/zsh

# This script is intended to build a package in
# development mode and listen for live changes.
# Script arguments:
#   -p (required): Name of the package to build.

# Exit with nonzero exit code if anything fails
set -e

# Define available packages
PACKAGES=(
  "slideout-stack"
)

# Read arguments
while getopts "p:" opt; do
  case $opt in
    p) # package
      if [[ "${PACKAGES[*]}" =~ $OPTARG ]]; then
        package=$OPTARG
      else
        echo -e "\033[0;31m(BUILD ERROR) Incorrect argument -p with value '$OPTARG'.\n"
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
if [ -z "$package" ]; then
  echo -e "\033[0;31m(BUILD ERROR) Missing argument -p for package.\n"
  exit 0
fi

# Delete package build directory
echo -e "\nCleaning up package build directory..."
rm -rf dist/"$package"

# Build package in watch mode
echo -e "\nBuilding package '$package' for development..."
ng build "$package" --watch --configuration development
