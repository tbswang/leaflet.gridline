#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

git checkout -b build

npm run build

git add dist

git commit -m "v$VERSION"

git tag v$VERSION
git push --tags

echo "Uploading to NPM..."

npm publish

git checkout master
git branch -D build

echo "All done."