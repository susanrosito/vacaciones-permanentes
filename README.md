# vacaciones-permanentes [![Build Status](https://travis-ci.org/robaud/vacaciones-permanentes.svg?branch=develop)](https://travis-ci.org/robaud/vacaciones-permanentes)
Proyecto MEAN para la materia de Desarrollo de Softwaregit st

## Correr el proyecto

Primero correr el servidor de mongo en un puerto estándar
```
mongod
```

Instalar todas las dependencias con npm
```
npm install
```

Instalar las dependencias del cliente con bower
```
bower install
```

Correr la aplicación usando grunt
```
grunt
```

## Acceder a la aplicación

Una vez levantada la aplicación puede correr la aplicación
accediendo a
```
localhost:3000
```

## Test de la aplicación

Puede correr los tests mediante
```
npm test
```

Los tests corren JSCS y JSHint para validar el
código JavaScript previo a cualquier otro paso.
La base de datos usada para correr los tests es
independeniente a la base de datos de desarrollo
con lo que no debes preocuparte de levantar una
nueva base de datos para correr los tests.
