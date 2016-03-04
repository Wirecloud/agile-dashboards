#!/bin/bash


if [ "$1" == "install" ]; then
    command="npm install"
else
    command="grunt $1"
fi

for i in * ; do
    if [ -d "$i" -a -f "$i/Gruntfile.js" ]; then
        cd $i
        cat << EOF


#######
Buiding ${i}
#######


EOF
        $command
        cd ..
    fi
done
