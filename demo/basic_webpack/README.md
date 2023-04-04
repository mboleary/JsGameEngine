# Basic JSGE Demo

This is a general demo of JSGE using Webpack for building the project.

## Running locally

To run this demo locally, you can use any http server used to serve static content. The easiest one to use will probably be the one built into python. 

```
npm run build
cd dist
python3 -m http.server <port> --bind 127.0.0.1
```

You can also use [the serve npm package](https://www.npmjs.com/package/serve).