# Private LogIn API
RESTful API con LogIn para sistema privado

## Endpoints

### Módulo autentificación

#### GET
- **/api/auth/check** Verificar sesion iniciada y obtener tipo de usuario

  - Requiere estar logueado

#### POST
- **/api/auth/signup** Registrar usuario.

  - Requiere administrador

```
{
  "username": string min(3) max(20) required,
  "password": string min(3) required,
  "name": string min(3) max(30) required,
  "patLastName": string min(3) max(30) required,
  "matLastName": string min(3) max(30),
  "phone": string min(3) max(15) required,
  "type": string valid('admin','general','independiente') required
}
```

- **/api/auth/login** Iniciar sesion

  - Requiere no estar logueado
```
{
    "username": string min(3) max(20) required,
    "password": string min(3) required
}
```

#### PUT
- **/api/auth/changePassword/[id]** Cambiar la contraseña del usuario indicado en el parámetro con la contraseña del administrador actual

  - Requiere administrador
```
{
    "password":  string min(3) required,
    "newPassword":  string min(3) required
}
```

#### DELETE
- **/api/auth/logout** Cerrar la sesión del usuario actual

  - Requiere estar logueado

### Módulo usuarios

#### GET
- **/api/users/all/[page]** Obtener los datos de todos los usuarios. Página y cantidad de páginas. Cada página contiene 20 registros.

  - Requiere administrador


- **/api/users/current** Obtener los datos del usuario actual

  - Requiere estar logueado

- **/api/users/search/[id]** Obtener los datos del usuario indicado

  - Requiere administrador


#### PUT
- **/api/users/current** Actualizar los datos del usuario actual

  - Requiere estar logueado
- **/api/users/search/[id]** Actualizar los datos del usuario indicado

  - Requiere administrador
```
{
    "name": string min(3) max(30) required,
    "patLastName": string min(3) max(30) required,
    "matLastName": string min(3) max(30),
    "phone": string min(3) max(15) required
}
```

#### DELETE
- **/api/users/current** Elimina al usuario actual

  - Requiere estar logueado

- **/api/users/search/[id]** Elimina al usuario indicado

  - Requiere administrador

