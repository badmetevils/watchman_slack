const ENDPOINTS_BASEURL = {
  dev: {
    apiHost: {
      base_url: JSON.stringify('http://localhost:8081'),
      version: JSON.stringify('/api/v1')
    }
  },
  prod: {
    apiHost: {
      base_url: JSON.stringify('http://localhost:8081'),
      version: JSON.stringify('/api/v1')
    }
  }
};
module.exports = ENDPOINTS_BASEURL;
