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
