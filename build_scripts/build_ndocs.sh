#!/bin/bash

echo "ND Build start"

# Install Mono

sudo apt install gnupg ca-certificates
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb https://download.mono-project.com/repo/ubuntu stable-focal main" | sudo tee /etc/apt/sources.list.d/mono-official-stable.list
sudo apt update

sudo apt install mono-devel

echo "Mono installed"

# Install Naturaldocs

curl https://www.naturaldocs.org/download/natural_docs/2.2/Natural_Docs_2.2.zip --output NaturalDocs.zip
unzip NaturalDocs.zip -d NaturalDocs

echo "ND downloaded"

# Generate Naturaldocs

git rm -r docs/naturaldocs/*
mkdir docs/naturaldocs/

mono NaturalDocs/Natural\ Docs/NaturalDocs.exe nd_config -o docs/naturaldocs/

git add docs/*

echo "Docs update completed"

# Commit and push changes

git config --global user.email "msharan@ucsd.edu"
git config --global user.name "Mayank Sharan"
git commit -m "Updating Natural docs"
echo "Changes committed"

git push
echo "Changes pushed"

echo "Workflow complete"
