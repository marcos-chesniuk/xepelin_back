# Vank API

Vank API es un proyecto realizado en Express (framework de Node.js) junto con Typescript a forma de desafío por parte de Xepelin.

Se trata de una API que sería utilizada por clientes de Vank para la consulta de facturas y gestión de clientes.

---

## Instalación


### Entorno local

Para correr la API localmente necesitará seguir los siguientes pasos:

1. Clonar el repositorio en el directorio deseado.

```bash
git clone https://github.com/marcos-chesniuk/xepelin_back.git

```

2. Colocar el archivo .env adjunto en el mail en la carpeta raíz del proyecto.
3. Instalar las dependencias con npm

```bash
npm i
```

4. Lanzar la API con nodemon

```bash
npm run start:nodemon
```

5. En la consola deberia figurar la siguiente frase:

```bash
Development server is listening on port 3000
```

### Docker container

Para correr el proyecto en un contenedor de Docker, seguiremos estos pasos:

1. Compilamos el proyecto estando en la carpeta raíz del proyecto:

```bash
npm run build
```

2. Luego creamos el contenedor ejecutando el siguiente comando:

```bash
docker build -t jmdchesniuk/xepelin_back_vank .
``` 

2. Una vez finalizado el build, lo ejecutamos:

```bash
docker run --env NODE_ENV=development --env-file .env -p 80:3000 -d jmdchesniuk/xepelin_back_vank
```

3. El contenedor se encontrará listo para usar. La url a utilizar es simplemente [localhost](http://localhost).


### Heroku

Al día 24/03/2022 la API se encuentra desplegada en el PaaS Heroku siguiendo el link [xepelin-back.herokuapp.com](https://xepelin-back.herokuapp.com).

---

## Utilización

A continuación se detallan los endpoints habilitados


### Healtz

- **GET** {{API_URL}}/healtz
Comprobar salud de la API
    - response:
        ```
        Test OK!
        ```

### Clients

- **POST** {{API_URL}}/clients/create
Crear un nuevo cliente
    - body:
        ```json
        {
            "internalCode": number,
            "companyName": string,
            "taxId": string,
            "currencyId": number,
            "monthlyQuota": number,
            "bankRegistry": Array<number>
        }
        ```
    - response:
        - success:
            ```json
            {
                "message": 'Operation completed successfully'
            }
            ```
        - error:
            ```json
            {
                "message": `Error: {{MESSAGE}}`
            }
            ```

- **PUT** {{API_URL}}/clients/edit
  Editar un cliente existente
    - body:
        ```json
        {
            "taxId": string,
            "currencyId": number
        }
        ```
    - headers:
        ```json
        {
            "internalcode": number
        }
        ```
    - response:
        - success:
            ```json
            {
                "message": 'Operation completed successfully'
            }
            ```
        - error:
            ```json
            {
                "message": `Error: {{MESSAGE}}`
            }
            ```


### Invoices

- **GET** {{API_URL}}/list/{currencyId?}
Obtener listado de facturas con los valores de dinero convertidos a la moneda del cliente. En caso de introducir el parametro opcional *currencyId* se convertirá a la moneda solicitada.
Se pueden filtrar los resultados si se ingresan los parámetros query *vendorId*, *invoiceDateStart*, *invoiceDateEnd*.
    - params:
        ```json
        {
            "currencyId": number
        }
        ```
    - params (query):
        ```json
        {
            "vendorId"?: string,
            "invoiceDateStart"?: date,
            "invoiceDateEnd"?: date
        }
        ```
    - headers:
        ```json
        {
            "clientcurrencyid": number
        }
        ```
    - response:
        - success:
            ```json
            {
                "message": 'Operation completed successfully',
                "result": [
                    {
                        "invoiceId": number,
                        "vendorId": number,
                        "invoiceNumber": string,
                        "invoiceTotal": number,
                        "paymentTotal": number,
                        "creditTotal": number,
                        "bankId": number
                    },
                    ...
                ]
            }
            ```
        - error:
            ```json
            {
                "message": `Error: {{MESSAGE}}`
            }
            ```
---

### Postman collection

Adjunto en el mail se encuentra la colección de Postman necesaria para probar la api. 