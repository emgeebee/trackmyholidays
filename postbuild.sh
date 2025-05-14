#!/bin/bash

mv ./build/static/js/* ./build/
mv ./build/static/css/* ./build/
awk '{gsub(/static\/js\//,""); print}' build/index.html > build/index1.html
awk '{gsub(/static\/css\//,""); print}' build/index1.html > build/index2.html
mv build/index2.html build/index.html
rm build/index1.html

