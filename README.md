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
  
  // set the authentication mode
  // one of ['apikey', 'user', 'bearer', 'user-bearer']
  mode: 'apikey',
  // required when mode is set to 'user'
  // https://<your company>.itglue.com
  subdomain: 'yourcompany',
  // required when mode is set to 'user'
  user: { 
    email: 'user@yourcompany.com', 
    password: 'userpassword'
  },
  // JWT, required when mode is set to 'bearer' or 'user-bearer'
  token: '12345abcdef' 
})


itg.get({path, params})
  .then(result => {
    // result
  })
  .catch(error => {
    // error
  });
  
itg.post({path, params, body}).then()

itg.delete({path, params}).then()

itg.patch({path, params, body}).then()

```

### Bearer Authentication

```js
const itg = new ITGlue({
  mode: 'bearer',
  token,
})

```

### User Authentication

The library will request and cache a new bearer token in memory for the duration of the running process.

```js
const itg = new ITGlue({
  mode: 'user',
  subdomain,
  user: {
    email, 
    password,
  }
})

```

### Search

Using `user-bearer` authentication, a search endpoint is provided.

```js
const itg = new ITGlue({
  mode: 'user-bearer',
  subdomain,
  token
});

itg.search({
  query,       // wildcard match
  related,     // return related items
  limit,       // page size
  kind,        // comma separated list of types, e.g. passwords,organizations
  sort,        // property to sort
  filter_organization_id   // filter results to an organization
})
```