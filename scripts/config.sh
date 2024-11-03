#!/usr/bin/env bash

# Console log colors
export COLOR_DEBUG='\033[0m'
export COLOR_ERROR='\033[0;31m'
export COLOR_SUCCESS='\033[0;32m'
export COLOR_WARNING='\033[0;33m'
export COLOR_INFO='\033[0;34m'

# Available library packages
export LIBRARY_PACKAGES=(
  "slideout-stack"
)

# Valid pre-release tags
export PRERELEASE_TAGS=(
  "alpha"
  "beta"
  "rc"
)
