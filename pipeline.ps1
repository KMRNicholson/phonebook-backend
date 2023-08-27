[CmdletBinding()]
param (
    [Parameter()]
    [switch]
    $Deploy = $false,

    [Parameter()]
    [string]
    $CommitMessage
)

$devDir = 'C:\dev'
$frontendDir = Join-Path $devDir 'fullstackopen/part2/phonebook'
$frontendBuild = Join-Path $frontendDir 'build'
$backendDir = Join-Path $devDir 'react/phonebook-backend'
$frontendDist = Join-Path $backendDir 'frontend'

Remove-Item $frontendDist -Recurse -Force
Set-Location $frontendDir
& npm run build
Copy-Item $frontendBuild $frontendDist -Container -Recurse -Force

if($Deploy){
    Set-Location $backendDir
    & git add .
    & git commit -m $CommitMessage
    & git push
}