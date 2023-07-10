# fauna-workers

This code is based on https://github.com/fauna-labs/fauna-workers by Copyright Fauna, Inc. Licensed MIT-0.

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
npm run start
```

## Deploy

```
npm run deploy
```
