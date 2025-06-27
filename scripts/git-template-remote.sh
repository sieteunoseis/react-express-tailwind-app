#!/bin/bash

# See https://www.mslinn.com/blog/2020/11/30/propagating-git-template-changes.html

function help {
  if [ "$1" ]; then printf "\nError: $1\n\n"; fi
  echo "Usage:

$0 [--fresh] templateUrl newProjectName

Options:
  --fresh    Start with a fresh git history (removes template commit history)"
  exit 1
}

if [ -z "$(which git)" ]; then
  echo "Please install git and rerun this script"
  exit 2
fi

if [ -z "$(which hub)" ]; then
  echo "Please install hub and rerun this script"
  exit 3
fi

# Parse arguments
FRESH_HISTORY=false
TEMPLATE_URL=""
PROJECT_NAME=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --fresh)
      FRESH_HISTORY=true
      shift
      ;;
    -*)
      help "Unknown option: $1"
      ;;
    *)
      if [ -z "$TEMPLATE_URL" ]; then
        TEMPLATE_URL="$1"
      elif [ -z "$PROJECT_NAME" ]; then
        PROJECT_NAME="$1"
      else
        help "Too many arguments"
      fi
      shift
      ;;
  esac
done

if [ -z "$TEMPLATE_URL" ]; then help "No git project was specified as a template."; fi
if [ -z "$PROJECT_NAME" ]; then help "Please provide the name of the new project based on the template"; fi

git clone "$TEMPLATE_URL" "$PROJECT_NAME"
cd "$PROJECT_NAME"

if [ "$FRESH_HISTORY" = true ]; then
  echo "Creating fresh git history..."
  rm -rf .git
  git init
  git add .
  git commit -m "Initial commit from template"
else
  git remote rename origin upstream
  git remote set-url --push upstream no_push
fi

# Add the -p option to create a private repository
hub create "$PROJECT_NAME"
git branch -M master
git push -u origin master