# songi do jacka syna!!!
@echo off
setlocal enabledelayedexpansion
#else ifn empty create empty json file
set "folder=./songs"
if "%1" neq "" (
  set "folder=%1"
)

if not exist "%folder%\" (
  echo Folder "%folder%" does not exist.
  exit /b 1
)

set "json_file=%folder%\names.json"
set "names_array=["
for %%f in ("%folder%\*") do (
  if not "%%~nf" == "" (
    set "names_array=!names_array!"%%~nf%%~xf","
  )
)

set "names_array=!names_array:~0,-1!]"
echo !names_array! > "%json_file%"

echo JSON file saved as "%json_file%"

endlocal

