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

mono NaturalDocs/Natural\ Docs/NaturalDocs.exe nd_config
echo "Docs update completed"

# Clone the docs repo
git clone https://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@github.com/CSE210-Group5/cse210-fa22-ucsd-group5.git docs_repo
echo "Docs repo cloned"

cd docs_repo
git checkout msharan/documentation
cp ../documentation/* docs/naturaldocs/

git add docs/*

git commit -m "Updating Natural docs"
echo "Changes committed"

git push
echo "Changes pushed"

echo "Workflow complete"
