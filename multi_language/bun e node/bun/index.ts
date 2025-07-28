import { serve } from 'bun'

const hostname = '127.0.0.1'
const port = '3000'

const server = serve({
  port, 
  routes: {
    '/': () => new Response("Hello World!", {'Content-Type': 'text/plain'}),
    '/films': async () => {
      const file = Bun.file('../films.json')
      return Response.json(await file.json())
    }
  }
})


console.log(`Server running at http://${hostname}:${port}/`)
