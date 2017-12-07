:: Copy a seed Designer model to the working directory.
:: NewModel "Believe"

echo off
if [%1]==[] goto error
set DESIGN=%~1%

set MODELFOLDER=Designs\%DESIGN%\Models\
set CATALOGROOT=C:\Users\Steve Knipmeyer\Documents\Dimensions Jewelry\Projects\Catalog\
set SANDBOX=SandBox\

set DESTINATIONMODEL=Designer.3dm
set SOURCEMODEL=%DESIGN%.3dm

set SOURCEPATH=%CATALOGROOT%%MODELFOLDER%%SOURCEMODEL%
set DESTINATIONPATH=%CATALOGROOT%%SANDBOX%%DESTINATIONMODEL%

::XCOPY Options
:: /S = copy subdirectories
:: /e = copy empty directories
:: /f = display full filename
:: /d = copy only files that are newer
:: /y = overwrite without prompt
set XCOPY_OPTIONS=/f/y

::Copy Options
:: /A           Indicates an ASCII text file.
:: /B           Indicates a binary file.
:: /D           Allow the destination file to be created decrypted
:: destination  Specifies the directory and/or filename for the new file(s).
:: /V           Verifies that new files are written correctly.
:: /N           Uses short filename, if available, when copying a file with a
::              non-8dot3 name.
:: /Y           Suppresses prompting to confirm you want to overwrite an
::              existing destination file.
:: /-Y          Causes prompting to confirm you want to overwrite an
::              existing destination file.
:: /Z           Copies networked files in restartable mode.
:: /L           If the source is a symbolic link, copy the link to the target
::              instead of the actual file the source link points to.
set COPY_OPTIONS=/y

echo SourceModel      = %SOURCEMODEL%
echo SourcePath       = %SOURCEPATH%
echo DestinationModel = %DESTINATIONMODEL%
echo DestinationPath  = %DESTINATIONPATH%

echo on
copy %COPY_OPTIONS% "%SOURCEPATH%" "%DESTINATIONPATH%"
echo off

goto end

:error

echo usage NewModel [Design]

goto end

:end

