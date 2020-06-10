#!/bin/bash
IMAGE="simple-todo"
REPO="sokubedocker"

for f in ./features/*; do
    version=$(echo "$f" | cut -d '/' -f 3 )
    echo "f=$f, version=$version"
    cp "$f" features.json
    docker build -t "$REPO/$IMAGE:$version" .
    docker push "$REPO/$IMAGE:$version"
done

rm -f features.json