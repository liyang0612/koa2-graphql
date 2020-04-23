const http = require('http')
const app = require('./app')

app.on('error', function(err) {
  log.error('server error', err)
})

http.createServer(app.callback()).listen(4000, function() {
  console.log(`🚀 Server ready at http://localhost:4000${app.server.graphqlPath}`)
})