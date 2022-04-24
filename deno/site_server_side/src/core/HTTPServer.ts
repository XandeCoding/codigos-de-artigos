import { serve } from "https://deno.land/std@0.135.0/http/server.ts";

type Iroute = { [k: string]: () => Promise<Response> };

class HTTPServer {
  private routes: Iroute;
  private port: number;

  constructor(routes: Iroute, port?: number) {
    this.routes = routes;
    this.port = port ?? 7000;
  }

  private async initServerHandler(request: Request): Promise<Response> {
    if (request.method !== "GET") {
      return new Response("Unsuported method received!", { status: 405 });
    }

    const url = new URL(request.url);
    console.log("> Path:", url.pathname);

    if (!this.routes[url.pathname]) {
      return new Response("Path not found! 404", { status: 404 });
    }

    const response = await this.routes[url.pathname]();
    return response;
  }

  public serve() {
    console.info(`>> Serving in port ${this.port}`);
    serve(this.initServerHandler.bind({ routes: this.routes }), {
      port: this.port,
    });
  }
}

export default HTTPServer;
