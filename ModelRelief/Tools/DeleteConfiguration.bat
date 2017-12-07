:: Delete a database and its store/users folders.
:: DeleteConfiguration All | Development | Production | Test

echo off

if [%1]==[] goto usageError
set Configuration=%~1%

set DatabaseRoot=%MR%Database
set StoreRoot=%MR%wwwroot\store\

echo DatabaseRoot  = %DatabaseRoot%
echo StoreRoot     = %StoreRoot%
echo Configuration = %Configuration%

if [%1]==[All] goto All
if [%1]==[Development] goto Development
if [%1]==[Production] goto Production
if [%1]==[Test] goto Test
goto invalidConfiguration

:All
:: Database
cd %DatabaseRoot%
if exist ModelReliefDevelopment.db del/P  ModelReliefDevelopment.db
if exist ModelReliefProduction.db del/P  ModelReliefProduction.db
if exist ModelReliefTest.db del/P  ModelReliefTest.db

:: Files
call :deleteFiles Development
call :deleteFiles Production
call :deleteFiles Test
goto end

:Development
:: Database
cd %DatabaseRoot%
if exist ModelReliefDevelopment.db del/P  ModelReliefDevelopment.db

:: Files
call :deleteFiles Development
goto end

:Production
:: Database
if exist ModelReliefProduction.db del/P  ModelReliefProduction.db

:: Files
call :deleteFiles Production
goto end

:Test
:: Database
if exist ModelReliefTest.db del/P  ModelReliefTest.db

:: Files
call :deleteFiles Test
goto end

:: ------------- deleteFiles
:deleteFiles

if not exist %StoreRoot%%1%\users goto return
cd %StoreRoot%%1%
rmdir/s users

:return
goto:eof

:: ------------- Error Handling
:invalidConfiguration
echo Configuration %Configuration% is invalid.
goto usageError

:usageError
echo usage DeleteConfiguration "All | Development | Production | Test"
goto end

:: ------------- End
:end
set Configuration=
set DatabaseRoot=
set StoreRoot=
cd %MR%
