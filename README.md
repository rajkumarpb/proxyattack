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
