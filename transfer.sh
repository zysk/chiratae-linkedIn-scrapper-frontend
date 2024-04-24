#!/bin/bash

rm -rf ../chiratae-linkedIn-scrapper-backend/public/
cp -ra ./build/. ../chiratae-linkedIn-scrapper-backend/public/
touch ../chiratae-linkedIn-scrapper-backend/public/.gitignore
echo "Build files copied to BE directory!!"
