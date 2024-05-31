const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://www.nike.com",
    changeOrigin: true,
    onProxyRes: (proxyRes, req, res) => {
      // Remove the CSP headers that block iframe embedding
      delete proxyRes.headers["content-security-policy"];
      delete proxyRes.headers["x-frame-options"];
    },
    pathRewrite: {
      "^/proxy": "", // Remove /proxy from the URL path
    },
  })
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
