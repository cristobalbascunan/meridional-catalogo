#!/bin/bash
# 🚀 Despliegue del catálogo de Meridional Plastic en Kubernetes.
#
# A diferencia de app-facturacion, aquí no hay base de datos ni secrets que
# preparar a mano: el sitio es estático, así que el orden es simplemente
# namespace → aplicación → ingress.

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

cd "$(dirname "$0")"

if ! kubectl cluster-info &> /dev/null; then
    print_error "No se puede conectar al cluster de Kubernetes"
    print_error "Verifica tu kubeconfig: kubectl config view"
    exit 1
fi
print_info "Conectado al cluster de Kubernetes"

echo ""
echo "📦 Paso 1: Creando namespace..."
kubectl apply -f 00-namespace.yaml
print_info "Namespace creado"

echo ""
echo "🚀 Paso 2: Desplegando el catálogo..."
kubectl apply -f 10-catalogo.yaml
print_info "Deployment, Service y HPA aplicados"

echo ""
echo "⏳ Paso 3: Esperando a que los pods estén listos..."
kubectl wait --for=condition=ready pod -l app=catalogo -n meridional-plastic --timeout=180s
print_info "Catálogo listo"

echo ""
echo "🌐 Paso 4: Configurando Ingress..."
kubectl apply -f 20-ingress.yaml
print_info "Ingress configurado"

echo ""
echo "✅ Verificación final..."
kubectl get pods -n meridional-plastic
echo ""
kubectl get svc -n meridional-plastic
echo ""
kubectl get ingress -n meridional-plastic

echo ""
echo "======================================================"
echo "🎉 Despliegue completado"
echo ""
print_warning "Pendiente fuera de Kubernetes:"
echo "  1. Apuntar meridionalplastic.com y www a este cluster en IONOS"
echo "     (ver kubernetes/DNS_IONOS.md para la IP y los pasos)."
echo "  2. Esperar unos minutos a que cert-manager emita el certificado:"
echo "     kubectl get certificate -n meridional-plastic"
echo "======================================================"
