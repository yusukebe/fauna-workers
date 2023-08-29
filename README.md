# fauna-workers

## Install

```
npm install
```

## Setup

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
