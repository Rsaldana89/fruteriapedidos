# Guía para publicar ABF en Railway con MySQL

## 1. Preparar GitHub

1. Crea un repositorio nuevo en GitHub.
2. Sube todo el contenido de esta carpeta, incluyendo `Dockerfile`, `railway.toml`, `db/` y `scripts/`.
3. No subas `.env.local`; contiene configuración local y está excluido por `.gitignore`.

## 2. Crear el proyecto

1. En Railway selecciona **New Project**.
2. Elige **Deploy from GitHub repo**.
3. Selecciona el repositorio de ABF.
4. Railway detectará el `Dockerfile` automáticamente.

El primer despliegue puede funcionar sin base de datos. Los pedidos seguirán disponibles por WhatsApp.

## 3. Agregar MySQL

1. En el lienzo del proyecto pulsa **Create** o **+ New**.
2. Selecciona **Database → Add MySQL**.
3. Espera a que el servicio MySQL indique que está activo.

## 4. Conectar la aplicación con MySQL

Abre el servicio de la aplicación, entra a **Variables** y agrega:

```text
DATABASE_URL=mysql://${{MySQL.MYSQLUSER}}:${{MySQL.MYSQLPASSWORD}}@${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}
```

La palabra `MySQL` debe coincidir con el nombre del servicio de base de datos. Si lo renombraste, cambia también ese nombre en las referencias.

Agrega además:

```text
NEXT_PUBLIC_SHOW_PRICES=true
NEXT_PUBLIC_WHATSAPP_NUMBER=524422009394
ORDER_NOTIFICATION_EMAIL=abfmaxialimentos@gmail.com
ADMIN_BOOTSTRAP_USER=tu_usuario
ADMIN_BOOTSTRAP_PASSWORD=UNA_CONTRASEÑA_SEGURA_DE_12_O_MAS_CARACTERES
ADMIN_BOOTSTRAP_DISPLAY_NAME=Administrador ABF
ADMIN_SESSION_SECRET=UN_SECRETO_ALEATORIO_LARGO
```

Genera `ADMIN_SESSION_SECRET` localmente con:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

El primer predespliegue guardará el administrador en la tabla `admin_users` y cifrará la contraseña con bcrypt. Una vez comprobado el acceso, puedes eliminar las tres variables `ADMIN_BOOTSTRAP_*` y volver a desplegar; conserva `ADMIN_SESSION_SECRET`. La cuenta seguirá almacenada en MySQL. Después añade SMTP cuando esté listo.

## 5. Inicialización automática

`railway.toml` indica a Railway que ejecute antes de cada despliegue:

```text
node scripts/init-db.mjs
```

Este script crea las tablas si todavía no existen, prepara el administrador inicial cuando se proporcionan las variables `ADMIN_BOOTSTRAP_*` y no borra pedidos anteriores.

## 6. Generar dominio

1. Abre el servicio de la aplicación.
2. Ve a **Settings → Networking**.
3. Pulsa **Generate Domain**.
4. Copia el dominio asignado.
5. Agrega o actualiza:

```text
NEXT_PUBLIC_SITE_URL=https://TU-DOMINIO.up.railway.app
```

Vuelve a desplegar para que la dirección se aplique a metadata y sitemap.

## 7. Comprobar el despliegue

Abre:

```text
https://TU-DOMINIO.up.railway.app/api/health
```

Debe responder con `status: "ok"` y `databaseConfigured: true`.

Después:

1. Agrega un producto.
2. Completa un pedido de prueba.
3. Confirma que aparece “Pedido registrado en la plataforma”.
4. Ingresa a `/admin` y verifica que el pedido esté en la lista.

## 8. Conectarse desde la computadora

Instala la CLI en Windows:

```powershell
npm install -g @railway/cli
railway login
railway link
```

Para abrir una conexión con MySQL:

```powershell
railway connect MySQL
```

Esto requiere tener instalado el cliente `mysql`. Para usar DBeaver u otra interfaz sin instalarlo:

```powershell
railway connect MySQL --tunnel-only
```

Railway mostrará los datos temporales de conexión al túnel.

## 9. Pasar datos locales a Railway

Para una fase inicial normalmente conviene subir solo la estructura y comenzar Railway con pedidos nuevos. Si después necesitas copiar pedidos locales:

1. Exporta `orders` y `order_items` desde Adminer o MySQL Workbench.
2. Conéctate a Railway mediante `railway connect MySQL`.
3. Importa el archivo SQL asegurándote de conservar primero `orders` y después `order_items` por la llave foránea.

No publiques en GitHub respaldos que contengan nombres, teléfonos, direcciones o correos de clientes.
