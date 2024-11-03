#!/usr/bin/env bash

# This script is intended to publish all library
# packages to the npm public registry.
# Pre: Packages build directories must be at /dist folder.

# Exit with nonzero exit code if anything fails
set -e

# Import config file
source "scripts/config.sh"

# Define build verification function
verifyBuild() {
  buildDir=${1}

  if [ ! -d "$buildDir" ]; then
    echo -e "${COLOR_ERROR}(ERROR) Build directory $buildDir does not exist."
    exit 1
  fi
}

# Define publish package function
publishPackage() {
  packageName=${1}
  buildDir="./dist/${packageName}"

  verifyBuild "${buildDir}"

  buildVersion=$(node -pe "require('$buildDir/package.json').version")
  remoteVersion=$(npm view @molinet/"$packageName" version)

  if [ "$buildVersion" != "$remoteVersion" ]; then
    echo -e "\nPublishing ${COLOR_INFO}${packageName}@${buildVersion}${COLOR_DEBUG} package..."

    tag=$(echo "$buildVersion" | sed -E 's/^[^+-]+-([^-]+)\..*/\1/')

    if [[ ! "${PRERELEASE_TAGS[*]}" =~ $tag ]]; then
      tag="latest"
    fi

    npm publish "$buildDir" --tag "$tag"

    echo -e "${COLOR_SUCCESS}Package ${packageName} published successfully.${COLOR_DEBUG}"
  else
    echo -e "${COLOR_WARNING}Ignoring package already published: ${packageName}@${buildVersion}${COLOR_DEBUG}"
  fi
}

# Publish all packages
for packageName in "${LIBRARY_PACKAGES[@]}"; do
  publishPackage "${packageName}"
done

# Publish OK
echo -e "\n${COLOR_SUCCESS}All packages published successfully.${COLOR_DEBUG}"
