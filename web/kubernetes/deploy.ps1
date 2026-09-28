<#
  Despliegue del catálogo de Meridional Plastic en Kubernetes, desde PowerShell.

  Compila la imagen, la sube a Docker Hub y aplica los manifiestos, en ese
  orden. Es el equivalente en PowerShell de deploy.sh, pero además compila y
  sube la imagen: deploy.sh sólo aplicaba los manifiestos y asumía que la
  imagen ya estaba en el registro.

  Uso:
    .\deploy.ps1                 # build + push + deploy, con :latest
    .\deploy.ps1 -SkipBuild      # usa la imagen ya compilada localmente
    .\deploy.ps1 -SkipBuild -SkipPush   # imagen ya subida, sólo despliega
#>

[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [switch]$SkipPush
)

$ErrorActionPreference = 'Stop'

$Image = 'cristobalseplac/meridional-catalogo:latest'
$K8sDir = $PSScriptRoot
$WebDir = Join-Path $K8sDir '..'

function Write-Info { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn2 { param($msg) Write-Host "[!]  $msg" -ForegroundColor Yellow }
function Write-Err2 { param($msg) Write-Host "[X]  $msg" -ForegroundColor Red }

function Invoke-Native {
    # Ejecuta un comando externo (docker, kubectl) y corta el script si falla,
    # porque un error de PowerShell no detiene un exe externo por sí solo.
    param([string]$Message, [scriptblock]$Command)
    Write-Host ""
    Write-Host $Message
    & $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Err2 "Fallo (código $LASTEXITCODE)"
        exit 1
    }
}

if (-not $SkipBuild) {
    Invoke-Native "Paso 1: Compilando la imagen ($Image)..." {
        docker build -t $Image $WebDir
    }
    Write-Info "Imagen compilada"
}
else {
    Write-Warn2 "Compilación omitida (-SkipBuild)"
}

if (-not $SkipPush) {
    Invoke-Native "Paso 2: Subiendo la imagen a Docker Hub..." {
        docker push $Image
    }
    Write-Info "Imagen subida"
}
else {
    Write-Warn2 "Subida omitida (-SkipPush)"
}

Write-Host ""
Write-Host "Comprobando conexión con el clúster..."
kubectl cluster-info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Err2 "No se puede conectar al clúster de Kubernetes"
    Write-Err2 "Verifica tu kubeconfig: kubectl config view"
    exit 1
}
Write-Info "Conectado al clúster de Kubernetes"

Invoke-Native "Paso 3: Aplicando namespace..." {
    kubectl apply -f (Join-Path $K8sDir '00-namespace.yaml')
}
Write-Info "Namespace aplicado"

Invoke-Native "Paso 4: Aplicando Deployment, Service y HPA..." {
    kubectl apply -f (Join-Path $K8sDir '10-catalogo.yaml')
}
Write-Info "Manifiestos aplicados"

# Con la etiqueta :latest, kubectl apply no basta para que los pods vean la
# imagen nueva: el spec del Deployment no cambia, así que Kubernetes no
# reinicia nada. Un rollout restart fuerza a cada pod a volver a arrancar y,
# con imagePullPolicy: Always, a repescar la imagen recién subida.
Invoke-Native "Paso 5: Reiniciando el despliegue para repescar la imagen..." {
    kubectl rollout restart deployment/catalogo -n meridional-plastic
}

Invoke-Native "Esperando a que el nuevo despliegue esté listo..." {
    kubectl rollout status deployment/catalogo -n meridional-plastic --timeout=180s
}
Write-Info "Catálogo actualizado"

Invoke-Native "Paso 6: Aplicando Ingress..." {
    kubectl apply -f (Join-Path $K8sDir '20-ingress.yaml')
}
Write-Info "Ingress aplicado"

Write-Host ""
Write-Host "Verificación final..."
kubectl get pods -n meridional-plastic
Write-Host ""
kubectl get svc -n meridional-plastic
Write-Host ""
kubectl get ingress -n meridional-plastic

Write-Host ""
Write-Host "======================================================"
Write-Info "Despliegue completado"
Write-Host "======================================================"
