const fs = require('fs');
const https = require('https');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = 5001;

const httpsOptions = {
  key: fs.readFileSync('./cert/local.ycseng.com-key.pem'),
  cert: fs.readFileSync('./cert/local.ycseng.com.pem'),
  requestCert: false,
  rejectUnauthorized: false,
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(PORT, err => {
      if (err) throw err;
      console.info(`> HTTPS: Ready on https://local.ycseng.com:${PORT}`);
    });
});
