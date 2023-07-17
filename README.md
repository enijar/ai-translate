# AI Translate

Translate English text into different languages.

> Generate and use your own [Open API key](https://platform.openai.com/account/api-keys)

### Demo

[![Demo](.github/demo.mp4)]

### Getting Started

Set up `ENV_VARS`:

```shell
cp .env.example .env
```

Run app in development mode:

```shell
nvm use # uses supported Node version for this project
npm install
npm start
```

### Production Build

Set up `ENV_VARS`:

```shell
cp .env.example .env
```

Build app in production mode:

```shell
nvm use # uses supported Node version for this project
npm install
npm run build
```

Run app in production:

```shell
# Install PM2 globally to manage the server process
npm add -g pm2
pm2 start --name app server/build/index.js
```

### API Usage

```shell
curl -X POST 'http://localhost:3000/api/translate' \
-H 'Content-Type: application/json' \
--data-raw '{"text": "Hello, my name is James", "language": "french"}'
```
