#!/bin/bash
# Display the ModelRelief environment.

#red
printf "\e[38;5;196m"
echo MR=$MR
echo
#cyan
printf "\e[38;5;87m"
echo ASPNETCORE_ENVIRONMENT=$ASPNETCORE_ENVIRONMENT
echo
#magenta
printf  "\e[38;5;207m"
echo MRUrls=$MRUrls
echo MRDatabaseProvider=$MRDatabaseProvider
echo MRUpdateSeedData=$MRUpdateSeedData
echo MRInitializeDatabase=$MRInitializeDatabase
echo MRSeedDatabase=$MRSeedDatabase
echo MRExitAfterInitialization=$MRExitAfterInitialization
#reset
printf  "\e[0m"
