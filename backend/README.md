# HuertoHogar API

## Desarrollo

El backend requiere `HUERTOHOGAR_JWT_SECRET` en Base64, con al menos 32 bytes
aleatorios antes de codificarlo. Si falta o no cumple el formato y tamaño,
Spring Boot detiene el arranque.

Desde PowerShell, ejecuta estos comandos en `backend/` con JDK 21. El perfil
`dev` es el predeterminado. Carga nueve productos y seis cuentas de demostración
en H2 en memoria. Los cambios se pierden al detener el proceso.

```powershell
$jwtBytes = New-Object byte[] 32
$jwtRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try { $jwtRng.GetBytes($jwtBytes) } finally { $jwtRng.Dispose() }
$env:HUERTOHOGAR_JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
$env:SPRING_PROFILES_ACTIVE = 'dev'
$env:SERVER_ADDRESS = '127.0.0.1'
mvn spring-boot:run
```

`mvn clean test` y `mvn clean package` también usan esa variable. En IntelliJ
IDEA, elige JDK 21 en la configuración de ejecución, agrega
`HUERTOHOGAR_JWT_SECRET` y `SERVER_ADDRESS` en **Environment variables** y
guarda la configuración localmente. Puedes copiar el secreto desde PowerShell
con `Set-Clipboard -Value $env:HUERTOHOGAR_JWT_SECRET` y limpiar el portapapeles
después de pegarlo. Mantén el valor fuera del repositorio y de los logs.

`POST /api/auth/login` recibe `correo` y `password`. Devuelve `accessToken`,
`tokenType` (`Bearer`), `expiresIn` (3600 segundos) y `usuario`. Envía el
token en el encabezado `Authorization: Bearer <accessToken>` para las
operaciones protegidas. Swagger está disponible en `/swagger-ui.html`.

Usa estas cuentas exclusivamente en desarrollo. El administrador puede gestionar
productos y clientes. Los demás usuarios tienen el rol `CLIENTE`.

| Correo | Contraseña |
| --- | --- |
| admin@huertohogar.cl | AdminDemo2 |
| ana.torres@example.com | AnaDemo2 |
| diego.morales@example.com | DiegoDemo2 |
| camila.rojas@example.com | CamiDemo2 |
| felipe.soto@example.com | FeliDemo2 |
| valentina.perez@example.com | ValeDemo2 |

## Producción

Activa `prod` con `SPRING_PROFILES_ACTIVE=prod`. El backend escucha en
`127.0.0.1:8080` por defecto y deshabilita Swagger, OpenAPI y la consola H2.
Puedes cambiar el puerto con `SERVER_PORT` y la dirección con `SERVER_ADDRESS`.
Mantén loopback para la futura integración con Nginx.

Estas son las variables que debe recibir también el proceso en Linux.

| Variable | Valor |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `HUERTOHOGAR_DB_URL` | URL de un archivo H2. Ejemplo en Linux: `jdbc:h2:file:/var/lib/huertohogar/huertohogar`. |
| `HUERTOHOGAR_JWT_SECRET` | Secreto propio del entorno en Base64 con al menos 32 bytes aleatorios antes de codificar. Consérvalo entre reinicios. |
| `HUERTOHOGAR_ADMIN_CORREO` | Correo del administrador inicial. Mantén el mismo correo configurado en cada arranque. |
| `HUERTOHOGAR_ADMIN_PASSWORD` | Contraseña inicial, obligatoria si esa cuenta todavía no existe. Usa una contraseña aleatoria de al menos 12 caracteres y hasta 72 bytes UTF-8. |

Para probar en PowerShell, genera el secreto JWT como en desarrollo y ejecuta
esto desde `backend/`. La carpeta de este ejemplo queda ignorada por Git.

```powershell
$env:SPRING_PROFILES_ACTIVE = 'prod'
$env:HUERTOHOGAR_DB_URL = 'jdbc:h2:file:./data/verificacion/huertohogar'
$env:HUERTOHOGAR_ADMIN_CORREO = Read-Host 'Correo del administrador'
$adminPassword = Read-Host 'Contraseña inicial del administrador' -AsSecureString
$env:HUERTOHOGAR_ADMIN_PASSWORD = ([pscredential]::new('admin', $adminPassword)).GetNetworkCredential().Password
try { mvn spring-boot:run } finally {
    Remove-Item Env:HUERTOHOGAR_ADMIN_PASSWORD -ErrorAction SilentlyContinue
    $adminPassword.Dispose()
}
```

El primer arranque crea una cuenta `ADMINISTRADOR` con contraseña almacenada
como hash BCrypt. Los siguientes arranques reutilizan la cuenta y su hash.
Puedes retirar la variable de la contraseña una vez creada. Un correo que
ya pertenece a un cliente impide el arranque, igual que una configuración
obligatoria ausente o inválida. Las cuentas de demostración solo se cargan en
`dev`. Inicia producción con una base independiente.

Al inicializar un catálogo vacío, se guardan los nueve productos y un marcador
en una única transacción. Una base que ya contiene productos recibe el marcador
y conserva su catálogo. Después, el marcador evita que se vuelva a cargar el
catálogo, aunque se eliminen todos los productos.

Para comprobar la persistencia, inicia sesión con el administrador nuevo y usa
el token para crear un cliente y un producto, modificar el precio o stock de
un producto inicial y eliminar otro. Detén completamente Spring Boot y vuelve
a iniciarlo con la misma URL JDBC, el mismo correo y el mismo secreto JWT.
Inicia sesión con la contraseña original y comprueba el cliente, el producto
nuevo y la edición. Verifica que el producto eliminado siga ausente y que
las listas no contengan duplicados.

Usa una ruta absoluta en un directorio persistente, fuera del repositorio
y de los archivos temporales del despliegue. La cuenta del servicio debe poder
escribir en ese directorio. H2 agrega el sufijo `.mv.db` al archivo. Mantén
la base, los secretos, la configuración privada y los logs fuera de Git.
Para esta etapa se usa `spring.jpa.hibernate.ddl-auto=update`.
En producción real, la evolución del esquema requiere migraciones versionadas.

## Despliegue del backend en EC2 con systemd

### Preparar la instancia y el JAR

Confirma en EC2 la instancia y la huella SSH antes de usarla. Una vez
conectado, revisa `/etc/os-release`, `uname -m`, `free -h`, `df -h` y
`sudo ss -ltnp`. Comprueba que 8080 esté libre e inspecciona las rutas
de la tabla siguiente y cualquier instalación anterior. Si hay un JAR,
servicio o base previa, preserva sus datos y usa el procedimiento de
actualización de esta sección.

En Ubuntu 24.04, comprueba `/usr/bin/java -version`. Si falta Java 21,
instala el runtime con `sudo apt-get update` y
`sudo apt-get install --no-install-recommends openjdk-21-jre-headless`.
La unidad incluye un heap máximo de 512 MiB. Revisa la memoria disponible
antes de instalarla. Maven se ejecuta en el equipo local.

Desde `backend/` en PowerShell, configura el secreto temporal de desarrollo
como se indica arriba y ejecuta lo siguiente con JDK 21. Detén el
procedimiento si falla alguno de los comandos.

```powershell
git rev-parse HEAD
java -version
mvn clean test
mvn clean package
Get-FileHash -Algorithm SHA256 target/huertohogar-api-0.0.1-SNAPSHOT.jar
```

Transfiere el JAR ejecutable y la unidad por SCP a una carpeta nueva en el
hogar del usuario SSH. Este ejemplo usa un alias SSH confirmado llamado
`ec2` con su identidad configurada.

```powershell
ssh -o StrictHostKeyChecking=yes ec2 'umask 077 && mkdir ~/huertohogar-stage'
scp -o StrictHostKeyChecking=yes target/huertohogar-api-0.0.1-SNAPSHOT.jar deploy/huertohogar-api.service ec2:~/huertohogar-stage/
ssh -o StrictHostKeyChecking=yes ec2 'sha256sum ~/huertohogar-stage/huertohogar-api-0.0.1-SNAPSHOT.jar'
```

Compara el SHA-256 remoto con el local antes de instalar. Registra el
commit y el hash de cada despliegue.

### Instalar y configurar

| Ruta en EC2 | Propósito y permisos |
| --- | --- |
| `/opt/huertohogar/backend/app.jar` | JAR instalado por root, legible por el servicio. |
| `/var/lib/huertohogar/` | Datos H2 persistentes, propiedad de `huertohogar`, modo `0750`. |
| `/etc/huertohogar/backend.env` | Configuración privada de systemd, propiedad de `root:root`, modo `0600`. Directorio con modo `0700`. |
| `/etc/systemd/system/huertohogar-api.service` | Unidad instalada desde `deploy/huertohogar-api.service`. |

Para una instalación nueva, si la cuenta dedicada y los destinos aún no
existen, ejecuta desde el directorio remoto que contiene las transferencias.

```bash
sudo useradd --system --user-group --home-dir /var/lib/huertohogar \
  --shell /usr/sbin/nologin huertohogar
sudo install -d -m 0755 /opt/huertohogar/backend
sudo install -d -m 0750 -o huertohogar -g huertohogar /var/lib/huertohogar
sudo install -d -m 0700 /etc/huertohogar
sudo install -m 0644 huertohogar-api-0.0.1-SNAPSHOT.jar /opt/huertohogar/backend/app.jar
sudo install -m 0644 huertohogar-api.service /etc/systemd/system/huertohogar-api.service
sudo install -m 0600 /dev/null /etc/huertohogar/backend.env
```

En una sesión SSH privada, edita `backend.env` con `sudoedit`. Establece
`SPRING_PROFILES_ACTIVE=prod` y
`HUERTOHOGAR_DB_URL=jdbc:h2:file:/var/lib/huertohogar/huertohogar`. Para una
instalación nueva, genera `HUERTOHOGAR_JWT_SECRET` con 32 bytes aleatorios
en Base64 y consérvalo en el archivo. Puedes usar
`sudo sh -c '{ printf "HUERTOHOGAR_JWT_SECRET="; openssl rand -base64 32; } >> /etc/huertohogar/backend.env'`
una sola vez sin mostrar el valor. Configura `HUERTOHOGAR_ADMIN_CORREO` y añade
`HUERTOHOGAR_ADMIN_PASSWORD` para el primer arranque, usando una contraseña
aleatoria compatible con los límites de BCrypt descritos arriba. Tras confirmar
el primer login, retira solo la línea de la contraseña inicial y reinicia el
servicio. Conserva el correo, el secreto JWT y la URL de H2.

### Operar y comprobar el servicio

```bash
sudo systemd-analyze verify /etc/systemd/system/huertohogar-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now huertohogar-api
sudo systemctl is-active huertohogar-api
sudo systemctl is-enabled huertohogar-api
sudo systemctl status huertohogar-api --no-pager
sudo journalctl -u huertohogar-api -n 80 --no-pager
sudo ss -ltnp 'sport = :8080'
curl -fsS http://127.0.0.1:8080/api/productos
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/api/usuarios
```

Comprueba el perfil `prod` en el journal, el archivo
`/var/lib/huertohogar/huertohogar.mv.db`, la escucha exclusiva en
`127.0.0.1:8080` y la respuesta `401` de la ruta administrativa. Usa
`sudo systemctl start huertohogar-api`, `sudo systemctl stop huertohogar-api`
y `sudo systemctl restart huertohogar-api` para administrar el proceso.

Para verificar desde un cliente local, abre el túnel
`ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:8081:127.0.0.1:8080 ec2`.
Usa `http://127.0.0.1:8081` como base y mantén los tokens y contraseñas fuera
del historial y de los informes. Comprueba GET de catálogo y por ID, login
del administrador, `403` del cliente en una operación administrativa y CRUD
con un producto y cliente temporales. Edita el producto temporal, reinicia
el servicio, consulta ambos IDs y comprueba el cambio y el login original.
Elimina el producto temporal, reinicia otra vez y confirma `404`. Retira
también el cliente temporal al terminar.

### Actualizar el JAR

Compila y verifica el nuevo JAR en el equipo local y compara su hash tras
transferirlo. Conserva el JAR anterior para revertir. Si el cambio puede
afectar el esquema, detén el servicio antes de hacer una copia en frío de
H2 y mantenla con permisos restringidos. Instala el nuevo JAR en un archivo
auxiliar dentro de `/opt/huertohogar/backend/` y renómbralo a `app.jar`
en ese mismo directorio. Arranca o reinicia el servicio y repite las
comprobaciones de estado y HTTP. Conserva el archivo de entorno, el secreto
JWT y la base existente. Si falla, revisa el journal antes de revertir y
confirma la compatibilidad del esquema con el JAR anterior.
