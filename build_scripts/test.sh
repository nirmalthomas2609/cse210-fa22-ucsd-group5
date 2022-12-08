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

curl https://www.naturaldocs.org/download --output NaturalDocs.zip
unzip NaturalDocs.zip -d NaturalDocs

echo "ND downloaded"
