#!/bin/bash

echo "App build start"

npm install -d

echo "All dependencies installed"

npm run build

echo "Build succeeded"

mv dist greco_notes_app
zip -r greco_notes_app.zip greco_notes_app

echo "Zip complete"

ls dist/

echo "Attempting fancy things"

npm i -g @vercel/ncc

echo "NCC Installed"

npm install -g pkg

echo "Attempt 1"

pkg -t latest-linux,latest-win,latest-macos greco_notes_app/index.html

echo "Script Complete"

ls
