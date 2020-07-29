const ENDPOINTS_BASEURL = require('../configs/BuildEnvironments');
const BUILD_ENV = process.env.npm_config_appenv || 'dev';

const ALLOWED_BUILD_ENV = Object.keys(ENDPOINTS_BASEURL);

if (!ALLOWED_BUILD_ENV.includes(BUILD_ENV)) {
  console.error(
    `===========================================\n--appenv is not valid.\npossible values allowed ${ALLOWED_BUILD_ENV.join(
      ', '
    )}\n===========================================\n`
  );
  process.exit(-1);
}

console.table({
  'BUILDING FOR ': BUILD_ENV
});

module.exports = {
  BUILD_ENV,
  ENDPOINTS: ENDPOINTS_BASEURL[BUILD_ENV]
};
