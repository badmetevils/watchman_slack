# Introduction

- Add the config in the `./configs/BuildEnvironments.js` in the format as follows

  ```javascript
  [YOUR-ENV-IDENTIFIER] : {
        apiHost: {
            base_url: JSON.stringify("http://139.99.45.55:4000"),
            version: JSON.stringify("/api/v1"),
        },
      ...your other keys...

  }
  ```

  for dev `YOUR-ENV-IDENTIFIER` could be `dev` for production it could be `prod` add config as per your requirements once done the `--appenv` in the command is used to run/build the project according to your needs

- In the project there is a Global vairable declared called `APP_ENV` and return object of the active env of the project on which the app is running/build.
eg : if `--appenv` is `dev` then the `APP_ENV` will resolves to

    ```javascript
    {
            apiHost: {
                base_url: JSON.stringify("http://139.99.45.55:4000"),
                version: JSON.stringify("/api/v1"),
            }
            ... your other keys ...
    }
    ```

## Installation

```
npm install
```

## Start Dev Server

```
npm run start --appenv="prod" // default dev

```

## Build Prod Version

```
npm run build --appenv="prod" // default dev

```


## Deployment

use any server nginx/apache and point the index.html of the `build` directory and resolve all the 404 to the index.html

