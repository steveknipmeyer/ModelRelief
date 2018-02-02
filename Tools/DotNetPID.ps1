$process = "dotnet.exe"
Get-CimInstance Win32_Process -Filter "name = '$process'" | Select-Object ProcessId, CommandLine 
exit

