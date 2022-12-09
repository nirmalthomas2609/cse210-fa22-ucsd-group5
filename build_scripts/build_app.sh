#!/bin/bash

echo "App build start"

npm install -d

echo "All dependencies installed"

npm run build

echo "Build succeeded"

ls dist/

echo "Attempting fancy things"

npm i -g @vercel/ncc

echo "NCC Installed"

npm install -g pkg

echo "Attempt 1"

pkg -t node12-linux,node14-linux,node14-win dist/index.html

echo "Attempt 2"

pkg -t node12-linux,node14-linux,node14-win dist/bundle.js

echo "Script Complete"
