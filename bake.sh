 #! /bin/sh

input=$1
output=$2
resources=$input'/resources'

if [ ! -d "$input" ] || [ ! -d "$output" ]; then
    echo "Usage: bake.sh path/to/input path/to/output"
    exit 1
fi

rm -r $output
node bake.js $input $output

if [ -d "$resources" ]; then
    cp -r $resources $output
fi
