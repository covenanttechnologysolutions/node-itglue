# node-itglue

Simple authentication bindings for ITGlue.

## Authentication

This library offers three methods of authentication: api key, bearer and user.

### API Key

```js

const ITGlue = require('node-itglue');

const itg = new ITGlue({
  // API Key auth
  // your api key
  apikey: 'abcdef12345',
 
  // optional
  // set true if you're connecting to the European datacenter with API Key auth
  eu: false, 
  // timeout in ms
  timeout: 10000, 
  
  // set the mode for another authentication mode
  // one of ['apikey', 'user', 'bearer']
  mode: 'apikey'
  // required when mode is set to 'user'
  companyUrl: 'https://yourcompany.itglue.com'
  // required when mode is set to 'user'
  user: { email: 'you@yourcompany.com', password: 'yourpassword'}
  // JWT, required when mode is set to bearer
  token: '12345abcdef' 
})


itg.get({path, params})
  .then(result => {
    // result
  })
  .catch(error => {
    // error
  });
  
itg.post({path, params, body});

itg.delete({path, params});

itg.patch({path, params, body});

```

### Bearer Authentication

```js
const itg = new ITGlue({
  mode: 'bearer',
  token: '',
})

```

### User Authentication

The library will request and cache a new bearer token in memory for the duration of the running process.

```js
const itg = new ITGlue({
  mode: 'user',
  companyUrl: 'https://yourcompany.itglue.com',
  user: {
    email: '', 
    password: ''
  }
})

```

