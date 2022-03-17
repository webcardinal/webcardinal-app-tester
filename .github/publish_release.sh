#!/bin/bash

function publish_bundle() {
  root=$(pwd)

  repository=$1
  branch=$2
  dir=$3
  bundle=$4

  echo "Publishing into repository '$repository' in branch '$branch' from path '$(pwd)'"

  git clone "https://${GITHUB_TOKEN}@github.com/webcardinal/$repository.git --branch=$branch --depth=1 ./temp"

  git config user.name "Github Actions"
  git config user.email "github-actions@github.com"

  cd "$root/temp" || exit 1

  rm -rf dist/
  cp -r "$root/$dir/$bundle/dist" "$root/temp/dist"
  git add dist/
  git commit -m "WebCardinal release for $bundle (build-id #$GITHUB_RUN_NUMBER)"
  git push origin "$branch"

  rm -rf "$root/temp"

  cd "$root" || exit 2
}

function publish_distribution() {
  if [[ $1 == "-p" ]]
  then
    dir="release/production"
    branch=master
  else
    if [[ $1 == "-d" ]]
    then
      dir="release/development"
      branch=dev
    fi
  fi

  if [ -z "$branch" ]
  then
    echo "Use '-p' for production, or '-d' for development"
    return
  fi

  for path in "$dir"/*; do
    for key in $(echo "$path" | tr "-" "\n"); do
      if [[ $key != *bundle ]]; then
        if [[ $key != webcardinal ]]; then
          repo="webcardinal-$key-release"
        else
          repo="webcardinal-release"
        fi
        bundle="bundle-$key"

        publish_bundle "$repo" "$branch" "$dir" "$bundle"
      fi
    done
  done
}

#publish_distribution "$1"

publish_bundle "webcardinal-minimal-release" "master" "release/production" "bundle-minimal"
