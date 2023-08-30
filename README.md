# fauna-workers

This project presents an example application using Cloudflare Workers with the Fauna API.
The application serves as a REST API backend, underpinned by Fauna's document-based database.

The code is used in a Cloudflare tutorial. For further details, please refer to:

- https://developers.cloudflare.com/workers/tutorials/store-data-with-fauna/

## The stack

- [Cloudflare Workers](https://developers.cloudflare.com/)
- TypeScript
- [Hono](https://hono.dev)
- [Fauna](https://fauna.com/)

## Install

```
npm install
```

## Setup your secret key

For production:

```
wrangler secret put FAUNA_SECRET
```

For development, edit `.dev.vars`:

```
FAUNA_SECRET=your-secret
```

## Develop

```
npm run dev
```

## Deploy

```
npm run deploy
```

## Authors

- Yusuke Wada <https://github.com/yusukebe>

## License

MIT
