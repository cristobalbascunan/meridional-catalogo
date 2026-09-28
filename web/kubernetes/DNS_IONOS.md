# DNS en IONOS para meridionalplastic.com

El dominio está registrado en IONOS; el cluster (Rancher, el mismo donde corre
app-facturacion) vive en otro sitio. Para que `meridionalplastic.com` sirva el
catálogo hay que apuntar el DNS a la IP pública del cluster.

**IP pública del cluster: por confirmar.** No se ha podido rellenar todavía —
ver la nota al final de este documento.

## Registros a crear

En el panel de IONOS: **Dominios y SSL → meridionalplastic.com → DNS**.

| Tipo | Subdominio | Destino | TTL |
| --- | --- | --- | --- |
| A | @ (dominio raíz) | `<IP del cluster>` | 3600 |
| A | www | `<IP del cluster>` | 3600 |

No hace falta CNAME para `www`: el Ingress ya redirige `www.meridionalplastic.com`
a `meridionalplastic.com` (dominio canónico), así que basta con que las dos
direcciones resuelvan a la misma IP.

## Verificación

```powershell
nslookup meridionalplastic.com
nslookup www.meridionalplastic.com
# Ambos deberían devolver la IP del cluster.
```

La propagación tarda normalmente 15-30 minutos, hasta 48h en el peor caso.
Se puede seguir en <https://dnschecker.org/> buscando `meridionalplastic.com`,
tipo `A`.

## Certificado SSL

Una vez el DNS resuelve, cert-manager pide el certificado a Let's Encrypt
automáticamente (con el `ClusterIssuer` `letsencrypt-prod`, el mismo que usa
app-facturacion). El puerto 80 tiene que estar accesible desde fuera para que
la validación funcione — si el firewall del servidor ya deja pasar el tráfico
de app-facturacion, no hace falta tocar nada más.

```powershell
kubectl get certificate -n meridional-plastic
# NAME                        READY   SECRET                      AGE
# meridionalplastic-com-tls   True    meridionalplastic-com-tls   ...
```

Si se queda en `READY: False` más de 10 minutos:

```powershell
kubectl describe certificate meridionalplastic-com-tls -n meridional-plastic
kubectl get challenges -n meridional-plastic
```

## Nota sobre la IP pendiente

No he podido conectar con el cluster («local», el de app-facturacion) desde
esta sesión: los kubeconfig descargados en `Downloads/` tienen el token
caducado (los tres `local*.yaml`) o el certificado ya no es válido
(`cluster-app*.yaml`, `vps2.yaml`). En cuanto haya un kubeconfig válido, esto
se resuelve solo:

```powershell
kubectl get nodes -o wide
# o, si el ingress usa un Service tipo LoadBalancer:
kubectl -n ingress-nginx get svc
```

la columna `EXTERNAL-IP` (o `ExternalIP` en `get nodes` si el ingress usa
`hostNetwork`, como parece ser el caso por la guía de app-facturacion) es la
IP a poner en los dos registros A de arriba.
