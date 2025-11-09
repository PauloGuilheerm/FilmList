param(
  [switch]$ForceInstall,
  [switch]$SkipStart
)

$ErrorActionPreference = "Stop"

$rootPath = Resolve-Path "$PSScriptRoot\.."
Set-Location $rootPath

if ($ForceInstall -or -not (Test-Path "./node_modules" -PathType Container)) {
  Write-Host "Instalando dependencias..."
  npm install
} else {
  Write-Host "Dependencias ja instaladas. Pulando 'npm install'. Use -ForceInstall para reinstalar."
}

if (-not $SkipStart) {
  Write-Host "Iniciando servidor de desenvolvimento..."
  npm run dev
} else {
  Write-Host "Instalação finalizada. Execução do servidor pulada."
}

