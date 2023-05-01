# Pino Axiom Transport
This is a very basic transport to Axiom for Pino. It is using the `fetch` API to ensure support for Edge runtimes such as Vercel Edge and Cloudflare Workers. If you are using this in an environment which does not have access to the `fetch` api, you will have to polyfill it globally.

### Usage
```js
import pinoFactory from 'pino';

const logger = pinoFactory({
  transport: {
    pipeline: [{
      target: 'pino-axiom-transport',
      options: {
        dataset: process.env.AXIOM_DATASET,
        token: process.env.AXIOM_TOKEN,
      },
    }],
  },
});
```
