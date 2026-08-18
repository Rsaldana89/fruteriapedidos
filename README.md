# ABF Maxi Alimentos

Sitio corporativo y sistema de levantamiento de pedidos para ABF. Incluye catálogo real, carrito persistente, datos de contacto obligatorios, WhatsApp, MySQL opcional, correo SMTP opcional y panel administrativo.

## Configuración actual de teléfonos

- Teléfono visible y botón de llamada: **442 710 1006**.
- WhatsApp que recibe pedidos de prueba: **52 442 200 9394**.

El destino de WhatsApp está separado del teléfono público mediante `NEXT_PUBLIC_WHATSAPP_NUMBER`.

## Desarrollo local en Windows

Requiere Node.js 22 o superior.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Abre `http://localhost:5173`. El comando `npm run dev` usa directamente Vite y es compatible con PowerShell, CMD, macOS y Linux.

El sitio también arranca sin `.env.local`. Sin MySQL continúan funcionando Home, catálogo, carrito, formulario y WhatsApp.

## MySQL local con Docker Desktop

Esta es la forma recomendada para probar la base antes de Railway.

1. Instala y abre Docker Desktop.
2. Desde la carpeta del proyecto ejecuta:

```powershell
docker compose up -d
```

3. Copia la configuración si todavía no existe:

```powershell
Copy-Item .env.example .env.local
```

4. Asegura las tablas y el usuario administrador de prueba:

```powershell
npm run db:init
```

5. Comprueba la conexión:

```powershell
npm run db:check
```

6. Inicia el sitio:

```powershell
npm run dev
```

Al crear la base local, Docker prepara las tablas `admin_users`, `orders` y `order_items`, y guarda la cuenta de prueba definida en `db/local-admin.sql`. `npm run db:init` también es seguro para bases ya existentes. Los datos permanecen en el volumen `abf_mysql_data` aunque apagues los contenedores.

### Ver la base local

Abre `http://localhost:8080` y usa:

```text
Sistema: MySQL
Servidor: mysql
Usuario: abf_user
Contraseña: abf_local_2026
Base de datos: abf_alimentos
```

### Comandos útiles

```powershell
docker compose ps
docker compose logs mysql
docker compose stop
docker compose down
```

`docker compose down` conserva los pedidos. Para borrar deliberadamente la base local y comenzar de cero se utiliza `docker compose down -v`.

## Variables principales

```env
NEXT_PUBLIC_SITE_URL=http://localhost:5173
NEXT_PUBLIC_SHOW_PRICES=true
NEXT_PUBLIC_WHATSAPP_NUMBER=524422009394
DATABASE_URL=mysql://abf_user:abf_local_2026@127.0.0.1:3306/abf_alimentos
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número con código de país, sin `+`, espacios ni guiones.
- `DATABASE_URL`: conexión MySQL. Si está vacía o MySQL falla, WhatsApp sigue operativo.
- `NEXT_PUBLIC_SHOW_PRICES=false`: oculta precios y convierte el flujo en solicitud de cotización.

## Inicialización de MySQL

El comando siguiente es seguro para una base nueva o existente porque usa `CREATE TABLE IF NOT EXISTS`:

```powershell
npm run db:init
```

Railway ejecuta la misma inicialización antes de publicar cada versión.

## Subir a Railway

La guía detallada está en `GUIA-RAILWAY.md`. Resumen:

1. Sube esta carpeta a GitHub.
2. En Railway crea un proyecto mediante **Deploy from GitHub repo**.
3. Añade un servicio **MySQL** al mismo proyecto.
4. En el servicio de la aplicación configura `DATABASE_URL` usando variables de referencia del servicio MySQL.
5. Agrega las variables de WhatsApp, precios, administrador y correo.
6. Railway detectará el `Dockerfile`, ejecutará `scripts/init-db.mjs` y comprobará `/api/health`.
7. En **Networking**, genera el dominio público.

El proyecto incluye:

- `Dockerfile` multietapa.
- `railway.toml` con Dockerfile, predespliegue, health check y reintentos.
- `/api/health` para comprobar que la aplicación inició.
- inicialización automática de tablas.

## Administrador

El panel está en `/admin`. El inicio de sesión consulta usuarios reales de la tabla `admin_users`; la contraseña se guarda únicamente como hash bcrypt.

La configuración local incluida crea esta cuenta al ejecutar `npm run db:init`:

```text
Usuario: abfadmin
Contraseña: ABF-Pruebas-2026!
```

Esta cuenta es exclusivamente para pruebas locales. Antes de producción reemplaza estas variables:

```env
ADMIN_BOOTSTRAP_USER=tu_usuario
ADMIN_BOOTSTRAP_PASSWORD=UNA_CONTRASEÑA_SEGURA_DE_12_O_MAS_CARACTERES
ADMIN_BOOTSTRAP_DISPLAY_NAME=Administrador ABF
ADMIN_SESSION_SECRET=UN_SECRETO_ALEATORIO_LARGO
```

Genera el secreto de sesión con:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`npm run db:init` crea o actualiza la cuenta indicada y genera automáticamente el hash. En Railway, después del primer despliegue correcto puedes eliminar `ADMIN_BOOTSTRAP_USER`, `ADMIN_BOOTSTRAP_PASSWORD` y `ADMIN_BOOTSTRAP_DISPLAY_NAME`; conserva `ADMIN_SESSION_SECRET`. El usuario seguirá existiendo en MySQL y la contraseña ya no permanecerá en las variables del servicio.

## Correo SMTP opcional

```env
ORDER_NOTIFICATION_EMAIL=abfmaxialimentos@gmail.com
SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_USER=usuario
SMTP_PASSWORD=secreto
SMTP_FROM="ABF Pedidos <pedidos@dominio.com>"
```

Si falta una variable o SMTP falla, el pedido todavía puede enviarse por WhatsApp.

## Catálogo

Para volver a importar un Excel actualizado:

```powershell
npm run import:catalog
```

El catálogo público se guarda en `src/data/products.json` y no depende de MySQL.

## Compilación y pruebas

```powershell
npm run lint
npm run build:next
```

`npm run build` corresponde al alojamiento de OpenAI Sites. Para Railway y Vercel se utiliza `npm run build:next`.

## Estructura principal

```text
app/                    páginas, panel y API
db/mysql-schema.sql     tablas MySQL
docker-compose.yml      MySQL y Adminer locales
Dockerfile              imagen de producción
railway.toml            configuración Railway
scripts/init-db.mjs     inicialización automática
src/config/company.ts   datos públicos y WhatsApp
src/server/             MySQL, SMTP y sesión
```

## Pendientes antes de producción

- Cambiar el WhatsApp de pruebas por el número definitivo.
- Confirmar si los precios serán públicos.
- Aprobar legalmente el aviso de privacidad.
- Cambiar la cuenta administrativa local por credenciales seguras de producción.
- Configurar SMTP si se desea correo automático.
