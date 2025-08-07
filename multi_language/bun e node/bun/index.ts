import { serve } from 'bun'

const hostname = '127.0.0.1'
const port = '3000'

const server = serve({
  port,
  async fetch(req) {
    const pathName = new URL(req.url).pathname

    switch (pathName) {
      case '/':
       return new response("hello world!", {'content-type': 'text/plain'}) 
    case '/films':
      const file = Bun.file('../films.json', { type: "application/json" })
      return Response.json(await file) 
    }
  }
})


console.log(`Server running at http://${hostname}:${port}/`)
