#!/bin/bash
# ModelRelief deploy
set +

if [ $# -eq 0 ]; then
    echo "usage: $0 user@X.X.X.X"
    exit
fi

# ModelRelief root
scriptFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"/
cd $scriptFolder/..

# copy Publish
echo "Copying Publish folder to remote"
rsync -avz --del --exclude-from='./Tools/deployExclude.txt' ./Publish/ $1:~/modelrelief/

rsync -avz .vscode/settings.json $1:~/modelrelief/.vscode/
rsync -avz .gitignore $1:~/modelrelief/
