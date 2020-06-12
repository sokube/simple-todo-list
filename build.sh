#!/bin/bash
IMAGE="simple-todo"
REPO="sokubedocker"

build_version () {
    feature_file=$(echo "./features/$1")
    if [ -f "$feature_file" ]; then
        version=$1
        echo "Building version $1 with features file=$feature_file"
        cp "$feature_file" features.json
        docker build -t "$REPO/$IMAGE:$version" .
        docker push "$REPO/$IMAGE:$version"
        rm -f features.json
    else
        echo "Version $1 does not exist in ./features/"
    fi
}

if [ ! -z "$1" ]; then
    build_version $1
else
    for f in ./features/*; do
        version=$(echo "$f" | cut -d '/' -f 3 )
        build_version $version
    done

fi
