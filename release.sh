#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

npm run build:webpack

git tag v$VERSION
git push --tags

echo "Uploading to NPM..."

npm publish

echo "All done."