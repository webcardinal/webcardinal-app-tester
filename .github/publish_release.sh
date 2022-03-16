#!/bin/bash

function publish_bundle() {
  root=$(pwd)
  repository=$1
  branch=$2
  dir=$3
  bundle=$4

  cd "$root/$dir/$bundle" || exit

  echo "Publishing into repository '$repository' in branch '$branch' from path '$(pwd)'"
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/webcardinal/$repository.git"
  echo "Origin: https://${GITHUB_TOKEN}@github.com/webcardinal/$repository.git"

  git config user.name github-actions
  git config user.email github-actions@github.com

  git pull
  git add -A
  git commit -m "WebCardinal release for $bundle (build-id #$GITHUB_RUN_NUMBER)"
  git push origin "$branch"

  cd "$root" || exit
}

function publish_distribution() {
  if [[ $1 == "-p" ]]
  then
    dir="dist/production"
    branch=master
  else
    if [[ $1 == "-d" ]]
    then
      dir="dist/development"
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

publish_bundle "webcardinal-minimal-release" "master" "dist/production" "bundle-minimal"
