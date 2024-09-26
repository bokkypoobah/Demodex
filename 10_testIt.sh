#!/bin/sh

OUTPUTFILE=testIt.out

npx hardhat test | tee $OUTPUTFILE
# npx hardhat coverage | tee $OUTPUTFILE
grep gasUsed $OUTPUTFILE | uniq
