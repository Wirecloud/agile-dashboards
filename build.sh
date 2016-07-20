#!/bin/bash

echo $0
#Go to the right directory
cd $(dirname $0)

if [ "$1" == "install" ]; then
    command="npm install"
else
    command="grunt $1"
    rm dist/* 2> /dev/null
fi

for i in * ; do
    if [ -d "$i" -a -f "$i/Gruntfile.js" ]; then
        cd $i
        cat << EOF


#######
Buiding ${i}
#######


EOF
        rm dist/* 2> /dev/null
        $command
        if [ "$?" -ne "0" ]; then
        	exit 1
        fi
        cp dist/* ../dist/
        cd ..
    fi
done
