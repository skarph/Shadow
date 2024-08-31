#!/bin/sh

pushd .

mkdir tmp
cd tmp
export PATH=$PWD:$PATH

git clone -b ldoc-test https://github.com/skarph/Kristal.git kristal
cd kristal
git pull
cd -

git clone -b doc-builder https://github.com/skarph/luacats-docgen lua-language-server
cd lua-language-server
git pull
cd -

popd
chmod +x tmp/lua-language-server/21-07-24-ubuntu-binary/lua-language-server
tmp/lua-language-server/21-07-24-ubuntu-binary/lua-language-server --doc=tmp/kristal --doc_out_path=app/data

rm -rf tmp

#get ninja binaries manually (cant use a package manager)
#curl -sL $(curl -s https://api.github.com/repos/ninja-build/ninja/releases/latest | grep -o "http.*ninja-linux.zip") --output ninja.zip
#unzip -o ninja.zip
#rm ninja.zip
#chmod +x ninja

#cd lua-language-server
#bash make.sh
#cd -