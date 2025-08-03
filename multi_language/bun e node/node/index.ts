import http from 'node:http'
import url from 'url'
import { readFile } from 'fs/promises'

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const pathName = parsedUrl.pathname

  switch (pathName) {
    case '/':
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('Hello World!\n')
      break
    case '/films':
      const file = await readFile('../films.json')
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(file)
      break
  }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

