#!/bin/bash

pushd ./first-network
echo y | ./byfn.sh down
popd

echo Preparing to delete all stopped Docker containers
echo DO NOT CONTINUE IF YOU DO NOT WANT TO PRUNE THE SYSTEM
docker system prune -a

echo Deleting binary files now run ./startFabric.sh
rm -rf bin chaincode config
