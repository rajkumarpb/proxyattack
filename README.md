# proxy-attack
Secure your App from Proxy Attacks!

This simple to integrate module uses the various header values to determine whether or not a request is proxy attacked, and if so it will block the request.

Installation
=====

```bash
npm install proxy-attack --save
```

Usage
=====
Make sure to include this as the first middleware!

Blocking Attacks (sends 401 unauthorised):
```javascript
var proxy = require('proxy-attack');

....

app.use(proxy());
```

- If you need to log attacks in DB, need to specify the required database details like below.


```
var proxy = require('proxy-attack');

// 1. To Block Tor Request
const config = {
    dbHost:process.env.HOST,
    dbDialect:process.env.DIALECT,
    dbName:process.env.DATABASE,
    dbUser:process.env.USERNAME,
    dbPass:process.env.PASSWORD,
    tableName: tableName,
    trackLocation: true
};

app.use(proxy(config));
```

This plugin use sequelize for inserting log data in DB.

- If you need to track the Location of Request, need to enable trackLocation property to true in config (Refer above config)

