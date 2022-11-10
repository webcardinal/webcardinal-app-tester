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

  git config --local user.email "github-actions@github.com"
  git config --local user.name "github-actions"

  git pull origin master

  git checkout -b "$branch"

  #  echo "Structure after 'git pull'" && ls -R

  rm -rf dist/
  cp -r "../$dir/$bundle/dist/" "./"

  #  echo "Structure after 'cp'" && ls -R

  git add dist/

  if [[ $branch == "master" ]]
  then
    # increment the patch version inside package.json, without creating a separated commit (-no-git-tag-version)
    # and with ignoring the existing local changes (--force) - in order to increment the patch version in the same commit
    npm version patch -no-git-tag-version --force

    # add files changed by npm version command - put on separated line since package-lock file can be optional
    git add package.json 
    git add package-lock.json
  fi

  git commit -m "WebCardinal release for $bundle (build-id #$GITHUB_RUN_NUMBER)"

  if [[ $branch == "master" ]]
  then
    # read updated package version
    package_version=$(grep version package.json | awk -F \" '{print $4}')

    # set git tag with current package version
    git tag "v.$package_version"

    # push tag
    git push --tags origin
  fi

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
