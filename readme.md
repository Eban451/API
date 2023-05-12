# API PORTAFOLIO - TALENTO DIGITAL

Esteban Zuñiga (Eban451)


# Repositorio
[https://github.com/Eban451/API]

## Para que el proyecto funcione correctamente es necesario la instalación node.js, y mediante terminal con el comando "npm i" se deben instalar las siguientes dependencias:
- express
- pg
- cors
- node
- nodemon

# Creación Base de Datos

## La base de dato fue creada en PostgreSQL, pero deben ser seguido estos pasos para que funcioner de manera correcta ya que PostgreSQL y las diferentes base de datos por si solas no soportan el uso de las coordenadas, las que son necesarias para el correcto funcionamiento de la aplicación.

Primero se debe instalar el complemento Postgis desde el Aplication Stack Builder que se instala junto con con PostgreSQL (también puede instalarse al momento de instalar PostgreSQL), de esta manera:

![App Screenshot](https://github.com/Eban451/API/blob/master/screenshots/IPostgis.JPG?raw=true)

Luego debe ser creada la base de datos en PostgreSQL (Por defecto se llama "final", aunque puede ser creada con otro nombre, pero debe actualizar los datos de la constate pool según sus parámetros).

Al ya tener creada su DB, debe abrir el programa Postgis, y realizar la siguiente acción:

![App Screenshot](https://github.com/Eban451/API/blob/master/screenshots/CPDB.JPG?raw=true)

Donde, se debe conectar Postgis con la base de datos previamente creada, usando sus datos correspondientes.

Ahora, se debe instalar el complemente de postgis mediante la Query Tool de esta manera:

![App Screenshot](https://github.com/Eban451/API/blob/master/screenshots/QTL1.png?raw=true)

Y al abrirse la ventana se debe digitar lo siguiente:
"CREATE EXTENSION postgis;"
Presionar el botón de ejecutar, y esperar esté todo listo

![App Screenshot](https://github.com/Eban451/API/blob/master/screenshots/QTL2.png?raw=true)

Luego de esto, está todo OK para poder crear las tablas en la base de datos.
Se deja un archivo llamado "Tablas e Insert de Puntos" para poder mostrar algunos puntos al cargar la aplicación

Igualmente dejo, un link de todo el proceso: https://www.youtube.com/watch?v=tTUM9XfDvqk

IMPORTANTE!
Crear el primer usuario con estas credenciales:

```bash
INSERT INTO users(name,email,categoria,password) VALUES('Master','master123@gmail.com',1,'$2b$10$LTx/J3o9heeA1BZzpYd5U.pjcWiyv1TU0TRQWh3IOk8RJXXiR7PTa');
```

Para que quedé como Master, para así tener todas la funcionalidades desbloqueadas.

Por otra parte, esta API con sus endpoints está en el siguiente puerto (aunque puede ser cambiado a su conveniencia):

```bash
app.listen(4000)
apiURL=http://localhost:4000
```

Clonar proyecto
```bash
  git clone https://github.com/Eban451/API.git
```

El proyecto se puede correr de esta manera igualmente
```bash
  npm run dev 
```

También dejo esta imagen de cómo se relaciona mi base de datos una vez creada:

![App Screenshot](https://github.com/Eban451/API/blob/master/screenshots/BD3.png?raw=true)
