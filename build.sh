#!/bin/bash
IMAGE="simple-todo"
REPO="sokubedocker"

build_version () {
    feature_file=$(echo "./features/$1")
    if [ -f "$feature_file" ]; then
        version=$1
        echo "-------------------------------------------------------------------------------"
        echo "Building version $1 with features file=$feature_file"
        cp -f "$feature_file" features.json
        docker build --no-cache=true --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') -t "$REPO/$IMAGE:$version" .
    else
        echo "Version $1 does not exist in ./features/"
    fi
}

push_version () {
    version=$1
    echo "-------------------------------------------------------------------------------"
    echo "Pushing $REPO/$IMAGE:$version"
    docker push "$REPO/$IMAGE:$version"
}

if [ ! -z "$1" ]; then
    build_version $1
    if [ "$2" == "--push" ]; then
        push_version $1
    fi
else
    for f in ./features/*; do
        version=$(echo "$f" | cut -d '/' -f 3 )
        build_version $version
        if [ "$2" == "--push" ]; then
            push_version $version
        fi
    done
fi
