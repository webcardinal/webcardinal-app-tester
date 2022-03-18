#!/bin/bash

function publish_bundle() {
  root=$(pwd)

  repository=$1
  branch=$2
  dir=$3
  bundle=$4

  echo "Publishing into repository '$repository' in branch '$branch' from path '$root'"

  mkdir "temp"
  cd "$root/temp" || exit 1

  git init
  git remote add origin "https://$ACCESS_TOKEN@github.com/webcardinal/$repository.git"

  echo "Origin: https://$ACCESS_TOKEN@github.com/webcardinal/$repository.git"

  git config --local user.email "github-actions@github.com"
  git config --local user.name "github-actions"

  git pull origin "$branch"

  echo "Structure after 'git pull'" && ls -R

  rm -rf dist/
  cp -r "../$dir/$bundle/dist/" "./"

  echo "Structure after 'cp'" && ls -R

  git add dist/
  git commit -m "WebCardinal release for $bundle (build-id #$GITHUB_RUN_NUMBER)"
  git push origin "$branch"

  cd "../" || exit 2

  rm -rf "$root/temp"
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

publish_distribution "$1"
