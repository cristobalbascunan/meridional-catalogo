# DNS en IONOS para meridionalplastic.com

El dominio está registrado en IONOS; el cluster (Rancher, el mismo donde corre
app-facturacion) vive en otro sitio. Para que `meridionalplastic.com` sirva el
catálogo hay que apuntar el DNS a la IP pública del cluster.

**IP pública del cluster: `89.167.95.242`.**

Se ha confirmado en vivo, no es un dato de una guía antigua: la guía de
app-facturacion decía `5.196.253.177`, pero un `nslookup` real a
`app.trabajadorautonomo.es` (que sirve desde este mismo cluster) resuelve hoy a
`89.167.95.242` — el servidor se movió en algún momento y esa guía quedó
desactualizada. Conviene repetir el `nslookup` antes de dar por buena esta IP
si ha pasado mucho tiempo desde que se escribió esto.

## Registros a crear

En el panel de IONOS: **Dominios y SSL → meridionalplastic.com → DNS**.

| Tipo | Subdominio | Destino | TTL |
| --- | --- | --- | --- |
| A | @ (dominio raíz) | `89.167.95.242` | 3600 |
| A | www | `89.167.95.242` | 3600 |

No hace falta CNAME para `www`: siguen haciendo falta los dos registros A de
arriba (ambos apuntando a la misma IP). El dominio canónico es
`www.meridionalplastic.com`; `meridionalplastic.com` (sin www) redirige a esa
versión conservando la ruta, pero la redirección la hace el propio nginx del
contenedor, no el Ingress — el cluster no admite `permanent-redirect` con
`$request_uri` ni snippets (ver el comentario en kubernetes/20-ingress.yaml).

## Verificación

```powershell
nslookup meridionalplastic.com
nslookup www.meridionalplastic.com
# Ambos deberían devolver 89.167.95.242 (o la IP que confirme el nslookup de
# la nota de arriba, si el servidor se ha movido otra vez desde entonces).
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

Un único certificado cubre los dos nombres (www y sin www), porque hay un
único Ingress con las dos entradas en `tls.hosts`. Si se queda en
`READY: False` más de 10 minutos:

```powershell
kubectl describe certificate meridionalplastic-com-tls -n meridional-plastic
kubectl get challenges -n meridional-plastic
```

## Estado del despliegue

Ya aplicado en el cluster («local») el 28/09/2026: namespace, Deployment
(2 réplicas, `catalogo-749df48dfb-*`), Service e Ingress. Verificado
directamente contra el Ingress (`--resolve` + `Host:`, sin esperar al DNS
real):

- `meridionalplastic.com/producto/precinto-impreso/` → 301 a
  `https://www.meridionalplastic.com/producto/precinto-impreso/` (conserva la
  ruta).
- `www.meridionalplastic.com/` y cualquier ficha → 200, contenido correcto.

Lo único que falta es esto: los dos registros A en IONOS. El certificado
(`meridionalplastic-com-tls`) se queda en `READY: False` — y los pods
`cm-acme-http-solver-*` esperando — hasta que el DNS resuelva a esta IP,
porque Let's Encrypt necesita alcanzar el reto HTTP-01 desde fuera. En cuanto
se propague el DNS, cert-manager lo emite solo; no hace falta volver a tocar
el cluster.

```powershell
kubectl get certificate -n meridional-plastic
kubectl get pods -n meridional-plastic
```
