var http = require('http');
var fs = require('fs');
http.createServer(function (request, response) {

  // 发送 HTTP 头部 
  // HTTP 状态值: 200 : OK
  // 内容类型: text/plain

  if (request.url === '/upload') {
    var chunks = []
    request.on('data', function(chunk) {
      chunks.push(chunk)
    })
    request.on('end', function() {
      var buffer = Buffer.concat(chunks)
      fs.writeFile('./static.png', buffer, function(err) {
        console.log(err)
      })
    })
  }
  response.writeHead(200, 
    {
      'Content-Type': 'text/plain'
    });

  // 发送响应数据 "Hello World"
  response.end('Hello World\n');
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');