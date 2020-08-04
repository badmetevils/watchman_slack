const ENDPOINTS_BASEURL = {
  dev: {
    apiHost: {
      base_url: JSON.stringify('http://139.99.45.55:4000'),
      version: JSON.stringify('/api/v1')
    }
  },
  prod: {
      apiHost: {
        base_url: JSON.stringify('http://139.99.45.55:4000'),
        version: JSON.stringify('/api/v1')
      }
  }
};
module.exports = ENDPOINTS_BASEURL;
