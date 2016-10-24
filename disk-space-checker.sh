#!/bin/bash

DIRECTORY=$(dirname $0)
echo DIRECTORY:$DIRECTORY
cd $DIRECTORY

exec >> logs/disk-space-checker.log
exec 2>&1

THRESHOLD=$1

export N=$(df | grep -P '/$' | grep -Po '\d+%' | grep -Po '\d+');

if [ "$N" -gt "$THRESHOLD" ]; then
  echo "$N > $THRESHOLD"

  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

  df -h | grep -P '/$' | ./disk-space-to-slack.js
else
  echo "$(date) $N < $THRESHOLD ok"
fi;
