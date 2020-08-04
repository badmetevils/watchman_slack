const ENDPOINTS_BASEURL = {
  local: {
    apiHost: {
      base_url: JSON.stringify('http://localhost:3000'),
      version: JSON.stringify('/api/v1')
    }
  },
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
