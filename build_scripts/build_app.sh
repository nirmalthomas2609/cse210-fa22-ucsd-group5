#!/bin/bash

echo "App build start"

npm install -d > misc_logs.txt

echo "All dependencies installed"

npm run build

echo "Build succeeded"

mv dist greco_notes_app
zip -r greco_notes_app.zip greco_notes_app

echo "Zip complete"

# npm i -g @vercel/ncc

# echo "NCC Installed"

# npm install -g pkg

# echo "Attempt to build executable"

# pkg -t latest-linux,latest-win,latest-macos greco_notes_app/bundle.js

# echo "Script Complete"

# ls
