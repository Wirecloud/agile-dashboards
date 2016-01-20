#!/bin/bash

for i in * ; do
    if [ -d "$i" -a -f "$i/Gruntfile.js" ]; then
        cd $i
        cat << EOF

#######
Buiding ${i}
#######


EOF
        grunt $1
        cd ..
    fi
done
