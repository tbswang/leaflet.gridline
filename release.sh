#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

npm run build:webpack

git add dist/index.js -F

git add .

git commit -m "v$VERSION"

git tag v$VERSION
git push --tags

echo "Uploading to NPM..."

npm publish

git checkout master

echo "All done."