:: Delete a database and its store/users folders.
:: DeleteConfiguration All | Development | Production | Test

echo off

if [%1]==[] goto usageError
set Configuration=%~1%

:: SQLite
::set DatabaseRoot=%MR%Database
:: SQLServer
set DatabaseRoot=%USERPROFILE%

:: user test data
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
cd/d %DatabaseRoot%
if exist ModelReliefDevelopment.mdf del/P  ModelReliefDevelopment.mdf
if exist ModelReliefDevelopment_log.ldf del/P  ModelReliefDevelopment_log.ldf

if exist ModelReliefProduction.mdf del/P  ModelReliefProduction.mdf
if exist ModelReliefProduction_log.ldf del/P  ModelReliefProduction_log.ldf

if exist ModelReliefTest.mdf del/P  ModelReliefTest.mdf
if exist ModelReliefTest_log.ldf del/P  ModelReliefTest_log.ldf

:: Files
call :deleteFiles Development
call :deleteFiles Production
call :deleteFiles Test
goto end

:Development
:: Database
cd/d %DatabaseRoot%
if exist ModelReliefDevelopment.mdf del/P  ModelReliefDevelopment.mdf
if exist ModelReliefDevelopment_log.ldf del/P  ModelReliefDevelopment_log.ldf

:: Files
call :deleteFiles Development
goto end

:Production
:: Database
cd/d %DatabaseRoot%
if exist ModelReliefProduction.mdf del/P  ModelReliefProduction.mdf
if exist ModelReliefProduction_log.ldf del/P  ModelReliefProduction_log.ldf

:: Files
call :deleteFiles Production
goto end

:Test
:: Database
cd/d %DatabaseRoot%
if exist ModelReliefTest.mdf del/P  ModelReliefTest.mdf
if exist ModelReliefTest_log.ldf del/P  ModelReliefTest_log.ldf

:: Files
call :deleteFiles Test
goto end

:: ------------- deleteFiles
:deleteFiles
cd/d %StoreRoot%%1%
if not exist users\nul goto return
echo Deleting %StoreRoot%%1%\users
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
cd/d %MR%
