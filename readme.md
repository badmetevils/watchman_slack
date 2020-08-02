## SLACK APP : WATCHMAN

Proactively looks for the presence changed by the users in the slack application

## Languages and tools used

- typescript : 3.9+
- node/slack : 5+
- express : 4+
- mysql2 : 2.1
- slack/bolt : 2+

## How to Setup the project

Make sure you are having the latest LTS of the node 12.xx + installed with latest `npm` package manager for installing all the required dependencies

> For development

- Copy the `sample.env` and rename it to `development.env` `[DIR : <project-root>/env]`

  ```sh
  # Environment
  NODE_ENV=""
  # Express  related Configs
  EXPRESS_PORT=""

  # BOLT
  PORT=""
  HOST=""

  #SLACK CONFIGS LEGACY
  LEGACY_SLACK_SIGNING_SECRET=""
  LEGACY_SLACK_BOT_TOKEN=""
  LEGACY_SLACK_USER_TOKEN=""

  #DATABASE SETTINGS
    DB_USER=""
    DB_PASSWORD=""
    DB_NAME=""
    DB_PORT=""
    DB_HOST=""

    # Business Logic

    PENALTY_IN_SECONDS="" #Default 1800
    WORK_HOUR_START="" #Default 10
    WORK_HOUR_ENDS="" #Default 19

  ```

- Add all the required information's in your `.env` file

- now run `npm install` to install the dependencies
- to start development server use `npm run start:dev`

> for Production

- copy `sample.env` [provided above] to `production.env` `[DIR : <project-root>/env]`
- to build and transpile the typescript code `npm run build`
- to serve the build `npm run start`

## Deployment

Please use the following steps to development

- make sure serve already have `Node` [12.x +] and `npm` [5.x +] installed
- install pm2 globally `npm install pm2 -g`
- `cd <project-root>
- `npm run build` to build the production build
- to run the application use `pm2 start npm --name "YOUR-APP-NAME" -- start` name of the app can be anything its just a identifier used by pm2 to identify the app in the list
