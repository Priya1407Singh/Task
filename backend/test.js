const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('hello');
});

server.listen(5000, () => {
  console.log('Server listening on port 5000');
});
