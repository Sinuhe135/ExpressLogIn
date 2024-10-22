# TramaAPI 
RESTful API para aplicación de Trama Cafe

## Endpoints

### GET
- http://velazduran.com:3000/api/usuarios/ Obtiene lista de todos los usuarios
- http://velazduran.com:3000/api/usuarios/[id] Obtiene usuario en base a id

### POST
- http://velazduran.com:3000/api/usuarios/ Sube usuario a base de datos

```
{
  "user": string,
  "password": string
}
```
### PUT
- http://velazduran.com:3000/api/usuarios/[id] Actualiza usuario de la base de datos

```
{
  "user": string,
  "password": string
}
```
### DELETE
- http://velazduran.com:3000/api/usuarios/[id] Elimina usuario
