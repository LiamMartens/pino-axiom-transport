import z from 'zod';
import * as build from 'pino-abstract-transport';
import pinoLevelAsString from './utils/pino-level-as-string.js';

export interface IAxiomOptions {
  dataset: string;
  token: String;
}

const logSchema = z.object({
  level: z.string().or(z.number()).nullable().optional(),
}).passthrough();

export default async function (axiomOptions: IAxiomOptions) {
  const promises = new Set<Promise<Response>>();

  if (typeof fetch === 'undefined') {
    throw new Error('fetch not available');
  }

  return build.default(async function (source) {
    source.on('data', (chunk: unknown) => {
      const result = logSchema.safeParse(chunk);
      const body = result.success ? {
        ...result.data,
        ...(result.data.level ? {
          level: pinoLevelAsString(result.data.level),
        } : {}),
      } : chunk;

      const fetchPromise = fetch(`https://api.axiom.co/v1/datasets/${axiomOptions.dataset}/ingest`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: [
          ['authorization', `Bearer ${axiomOptions.token}`],
          ['content-type', 'application/x-ndjson'],
        ],
      });
      fetchPromise.then(() => {
        promises.delete(fetchPromise);
      });
      promises.add(fetchPromise);
    });
  }, {
    close: async () => {
      await Promise.all(promises);
    },
  });
}
