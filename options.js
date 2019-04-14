module.exports = {
  apiUrl: 'https://api.schoology.com',
  rootPath: '/v1',
  headers: {
    'Content-Type': 'application/json',
    'Host': 'api.schoology.com'
  },
  authorization: {
    strategy: 'oauth1',
    oauth1: {
      consumerKey: 'e993008d7985640358536211ff3bc0a305ca417d2',
      consumerSecret: '1f7f14cd28427f19f31da1e8de7ba01d'
    }
  },
  endpointsPath: 'lib/objects'
}