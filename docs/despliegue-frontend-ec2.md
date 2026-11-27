# Despliegue de React en EC2 con Nginx

Nginx sirve el build de React en el puerto 80 y reenvía `/api` a Spring Boot en `127.0.0.1:8080`. El backend, su unidad `huertohogar-api` y el archivo H2 se administran por separado según [el procedimiento del backend](../backend/README.md).

## Compilar y transferir

Usa Node.js 24 y npm desde la raíz del repositorio. Registra el commit del build. Ejecuta `npm.cmd ci` si necesitas instalar las dependencias a partir de `package-lock.json`. La variable `VITE_API_URL=/api` configura el mismo origen para React y la API. Evita poner secretos en variables `VITE_*`, que son públicas en el bundle.

```powershell
git rev-parse HEAD
node --version
npm.cmd --version
$env:VITE_API_URL = '/api'
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Falló la compilación de React.' }
Get-ChildItem dist/assets
tar.exe -czf "$env:TEMP/huertohogar-web.tar.gz" -C dist .
Get-FileHash -Algorithm SHA256 "$env:TEMP/huertohogar-web.tar.gz"
```

Comprueba que `dist/` contiene `index.html`, los archivos CSS y JavaScript en `assets/` y las imágenes en `img/`. Revisa que el bundle use `/api` y que no apunte al servidor de desarrollo. La transferencia incluye únicamente el archivo comprimido de `dist/` y la [configuración de Nginx](../deploy/nginx/huertohogar.conf).

Confirma la IPv4 pública actual y la identidad SSH de la instancia en EC2. El ejemplo usa el alias `ec2`, configurado previamente con la identidad y la huella verificadas. Crea un directorio de preparación nuevo y transfiere los archivos.

Si no tienes el alias configurado, puedes conectarte desde PowerShell indicando la ruta local del `.pem` y la IPv4 pública confirmada. La huella del servidor debe estar previamente verificada y registrada en `known_hosts`.

```powershell
$claveEc2 = 'C:\ruta\a\labsuser.pem'
$ipEc2 = '<IPv4 pública confirmada>'
ssh.exe -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -i $claveEc2 "ubuntu@$ipEc2"
```

```powershell
$preparacion = ssh -o StrictHostKeyChecking=yes ec2 'mktemp -d ~/huertohogar-web-stage.XXXXXX'
if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar el directorio remoto.' }
$destino = 'ec2:{0}/' -f $preparacion
scp -o StrictHostKeyChecking=yes "$env:TEMP/huertohogar-web.tar.gz" deploy/nginx/huertohogar.conf $destino
ssh -o StrictHostKeyChecking=yes ec2 "sha256sum '$preparacion/huertohogar-web.tar.gz'"
```

Compara el hash remoto con el local antes de publicar.

## Primera publicación

En Ubuntu, comprueba que `huertohogar-api` está activo y habilitado, que `GET http://127.0.0.1:8080/api/productos` responde y que el puerto 80 está disponible. Revisa el espacio, las configuraciones Nginx existentes y `/var/www/huertohogar` antes de instalar o publicar. Si Nginx falta, instala solo ese paquete y sus dependencias mediante `sudo apt-get update` y `sudo apt-get install --no-install-recommends nginx`.

Desde el directorio de preparación remoto, asigna un identificador único `VERSION` a la publicación, por ejemplo el commit corto y la fecha UTC. Conserva las publicaciones anteriores. En una actualización, anota primero el destino de `readlink /var/www/huertohogar/current`.

```bash
VERSION=commit-fecha-utc
BASE=/var/www/huertohogar
sudo install -d -m 0755 "$BASE/releases"
sudo mkdir -m 0755 "$BASE/releases/$VERSION"
sudo tar -xzf huertohogar-web.tar.gz --no-same-owner --no-same-permissions -C "$BASE/releases/$VERSION"
sudo chmod -R u=rwX,go=rX "$BASE/releases/$VERSION"
sudo -u www-data test -r "$BASE/releases/$VERSION/index.html"
sudo ln -s "releases/$VERSION" "$BASE/.current-$VERSION"
sudo mv -Tf "$BASE/.current-$VERSION" "$BASE/current"
```

Para la primera activación, instala la configuración como `/etc/nginx/sites-available/huertohogar` y enlázala en `sites-enabled`. Si el único sitio activo es el enlace `default` de una instalación nueva, retira ese enlace porque ambos sitios usan `default_server`. Conserva el archivo original y los sitios ajenos. Si `nginx -t` falla, restaura la configuración activa anterior antes de recargar.

```bash
sudo install -m 0644 huertohogar.conf /etc/nginx/sites-available/huertohogar
sudo ln -s /etc/nginx/sites-available/huertohogar /etc/nginx/sites-enabled/huertohogar
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager
```

El `proxy_pass` omite una URI después del puerto para conservar rutas como `/api/productos` y `/api/auth/login`. Nginx reenvía `Authorization` y las respuestas de Spring Boot, incluidos los errores de la API. Las rutas de `BrowserRouter` usan `try_files` y sirven `index.html` si no existe un archivo para esa ruta. `/assets/` y `/img/` devuelven 404 para archivos inexistentes. [Proxy de Nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass) · [Directiva `try_files`](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)

## Verificar y actualizar

```bash
sudo nginx -t
sudo systemctl is-active huertohogar-api nginx
sudo systemctl is-enabled huertohogar-api nginx
sudo ss -ltnp 'sport = :80 or sport = :8080'
curl -fsS http://127.0.0.1/ -o /dev/null
curl -fsS http://127.0.0.1/api/productos
curl -si http://127.0.0.1/api/usuarios
```

Confirma HTTP 200 para el sitio y el catálogo JSON, y HTTP 401 para `/api/usuarios` sin credenciales. Revisa que `8080` esté limitado a loopback. Desde el navegador, abre la IPv4 pública por HTTP y comprueba CSS, JavaScript e imágenes, así como la recarga de `/productos`, `/producto/FR001`, `/login`, `/registro`, `/carrito` y `/admin`. Confirma que la API utiliza el mismo origen y que los errores de API devuelven la respuesta del backend. Verifica registro, login y roles, el CRUD de productos y usuarios con datos temporales, y el carrito con su compra simulada. Elimina los datos de prueba que hayas creado y conserva los registros previos.

Para actualizar el frontend, repite la compilación, la transferencia y el cambio atómico de `current`. Si la configuración de Nginx sigue siendo la misma, el cambio del enlace se aplica sin recargar el servicio. Si falla la verificación, crea un enlace auxiliar al destino anterior de `current` y reemplázalo con `mv -Tf` desde el mismo directorio. Este procedimiento actúa sobre los archivos de React y la configuración de Nginx. Spring Boot y H2 continúan ejecutándose durante la actualización.

La IPv4 pública puede cambiar al detener e iniciar la instancia. Confírmala antes de usar SSH o compartir la URL. El Security Group de esta instalación académica permite HTTP de entrada por TCP 80 desde `0.0.0.0/0` para que el sitio sea accesible desde otras redes. El puerto 8080 permanece privado. El HTTP de esta práctica se utiliza con cuentas y datos ficticios. Un despliegue con credenciales reales requiere HTTPS.
