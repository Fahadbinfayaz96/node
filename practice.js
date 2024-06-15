const http = require('node:http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify({
    title: "My First Blog Post",
    content: "This is the content of my first blog post...",
    author: "Fahad Bin Fayaz",
    email: "fahad@gmail.com",
    date: new Date().toISOString()
  }));
  res.end();
}).listen(3000);
