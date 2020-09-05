const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: process.env.REACT_APP_BASE_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/"
      }
      // cookieDomainRewrite: "http://localhost:3000"
    }))
}