# Dockerfile - Node with TypeScript

Good morning! Hope you’re all doing well. My fellow tech enthusiasts from the land of AI hype _still waiting for them to take our jobs so we can finally retire, right?_ 🙏

But while that doesn't happen, I’d like to share a Dockerfile structure I’ve been working on. Modesty aside, I think the result is pretty solid 😎. In my case, the initial image was around 1GB, and after some tweaks, it dropped to about 161MB (according to [Dive](https://github.com/wagoodman/dive))); it’s worth noting this was for a simple app built with [Hono](https://hono.dev/.

`**Note:** Keep in mind that your application might not end up the exact same size. It could be larger or smaller depending on your codebase and the dependencies installed in your project.`

```Dockerfile
FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY --chown=node:node package*.json tsconfig.json ./
COPY --chown=node:node /src ./src
RUN npm ci --silent
RUN npm run build
RUN npm ci --silent --omit=dev 

FROM node:lts-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
USER node
EXPOSE 3000
ENTRYPOINT ["node", "./dist/index.js"]
```

## For those not in a rush

While this Dockerfile covers most use cases, I’ll share some tips on how to use it and explain what happens in each step so you can customize it for your own needs.

### Exposing the application

First and most importantly: for your application to be accessible, it must be listening on the correct network interface (remember 0.0.0.0?). You also need to publish the container ports to the host machine. Here is an example command for an app using port 3000, which is the same one defined in the Dockerfile:

```Shell
docker run image_name:image_tag -p 3000:3000
```

If you are using Docker Compose, the ports field handles this for you. A basic configuration would look like this:

```YAML
services:
  node_api:
  build: .
    ports:
    - "3000:3000"
```

### Breaking it down

Now, let's look at the specifics:

- **1. Multi-stage Build:** The first block (the build phase) handles downloading dependencies and compiling the application. Once the code is transpiled, dev dependencies are removed to shrink the final image size.

- **2. Base Image:** I’m using the latest lts-alpine image (it makes keeping this post updated easier 😅). However, a best practice would be to specify both the Node and Alpine versions or use an image hash; this makes your build even more predictable and less prone to breaking changes.

    ```Dockerfile
         FROM node:24.12.0-alpine3.23 as BUILDER
    ```
    or 
    ```Dockerfile
    FROM     node@sha256:c921b97d4b74f51744057454b306b418cf693865e73b8100559189605f6955b8 AS builder
    ```

- **3. Security & Execution:** In the second stage, I only copy what is strictly necessary for the runtime. I then set the user to node (which comes by default in official images). This is crucial because, if omitted, Docker defaults to the root user, which can create security vulnerabilities.

- **4. Entrypoint:** Finally, I expose port 3000 (adjust to whichever port your app uses) and use the ENTRYPOINT command. Here, I run the transpiled JavaScript directly. Note that you could also use a script defined in your package.json if you prefer.

### Goodbye! :clap:

That’s it! Thanks for reading. I hope this article was helpful. I’ve looked for many Docker images in the past, but they always seemed too complex or lacked something I needed. While this model might not solve every single case, it serves as a great foundation for using Docker with Node and TypeScript.
