# HuertoHogar API

## Configurar JWT en desarrollo

El backend requiere `HUERTOHOGAR_JWT_SECRET` en Base64, con al menos 32 bytes
aleatorios antes de codificarlo. Si falta o no cumple el formato y tamaño,
Spring Boot detiene el arranque.

Desde PowerShell, genera un secreto para la sesión actual y arranca el backend
en loopback. Ejecuta estos comandos desde `backend/` con JDK 21.

```powershell
$jwtBytes = New-Object byte[] 32
$jwtRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try { $jwtRng.GetBytes($jwtBytes) } finally { $jwtRng.Dispose() }
$env:HUERTOHOGAR_JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
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

Las cuentas iniciales de EP2 son exclusivamente para demostraciones locales.
Antes de un despliegue, desactiva la cuenta administrativa de demostración o
reemplaza su credencial conocida. Configura un secreto propio del entorno y
publica la API mediante HTTPS.
