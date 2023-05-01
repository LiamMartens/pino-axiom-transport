# Pino Axiom Transport
This is a very basic transport to Axiom for Pino

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
