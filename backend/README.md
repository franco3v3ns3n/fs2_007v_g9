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
