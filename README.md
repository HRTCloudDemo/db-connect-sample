# db-connect-sample

A short sample Program to show how to connect to MongoDB and Redis

## MongoDB

### Environment Variable 
* `MONGODB_URL` The MongoDB URL with user name and password

  `export MONGODB_URL='mongodb://<user>:<password>@<ip>:<port>'`


## Redis

### Environment Variables 
* `REDIS_URL` The Redis URL with user name, password and db

  `export REDIS_URL='rediss://<user>:<password>@<hostname>:<port>/<DB>'`

  In the IBM Cloud the value can be retrieved from the value `connection.rediss.certificate.certificate_base64` of the Service Credentials

* `REDIS_CA_BASE64` Certificate authority for self signed certificate

  `export REDIS_CA_BASE64=<Base 64 encode ca>`

  In the IBM Cloud the value can be retrieved from the value `connection.rediss.composed` of the Service Credentials


## Cloudant

### Environment Variables 
* `CLOUDANT_URL` The Cloudant URL

  In the IBM Cloud the value can be retrieved from the value `url` of the Service Credentials

* `CLOUDANT_APIKEY` An Api key to access the Cloudant db

  In the IBM Cloud the value can be retrieved from the value `apikey` of the Service Credentials

## Run the sample

```
npm i
node index.js
```
