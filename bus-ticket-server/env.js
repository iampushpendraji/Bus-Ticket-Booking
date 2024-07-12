// PORT=<3000>
// HOST=<localhost>
// USR=<root>
// DATABASE=<Your-DB>
// PASSWORD=<Your-Pass>
// REFRESH_TOKEN_KEY=<Your-Ref-Token-Key>
// REFRESH_EXPIRY=<Time> (1h)
// ACCESS_TOKEN_KEY=<Your-Access-Token-Key>
// ACCESS_EXPIRY=<Time> (5h)
// SECRET_PUBLIC_KEY=<Secret-key-public>
// SECRET_PRIVATE_KEY=<Secret-key-private>


// FOR GENERATING THE PUBLIC AND PRIVATE KEY
/**
 * 
 * 
 * ssh-keygen -t rsa -b 1024 -m PEM -f src/keys/rsa.key
 * openssl rsa -in src/keys/rsa.key -pubout -outform PEM -out src/keys/rsa.key.pub 
 * 
 */