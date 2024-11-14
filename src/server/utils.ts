import { zodFunction } from "openai/helpers/zod";
import { createStreamableValue } from "ai/rsc";
import { v4 as uuidv4 } from "uuid";

export function withLogger(
  config: Parameters<typeof zodFunction>[0],
  response: ReturnType<typeof createStreamableValue>
) {
  const fn = config.function;

  return {
    ...config,
    function: fn
      ? async (...args: Parameters<typeof fn>) => {
          const output = await fn(...args);
          response.update(
            JSON.stringify({
              role: "tool",
              name: config.name,
              input: JSON.stringify(args[0], null, 2),
              output: JSON.stringify(output, null, 2),
              id: uuidv4(),
            })
          );
          return output;
        }
      : undefined,
  };
}

/**
 * This is just a mock rate limiter. Choose a real one instead.
 */
export class Ratelimiter {
  #limit: number;
  #counter = new Map<string, number>();

  constructor({ limit }: { limit: number }) {
    this.#limit = limit;
  }

  check(identity: string) {
    const entry = this.#counter.get(identity);
    if (typeof entry === "undefined") {
      this.#counter.set(identity, 1);
      return true;
    }

    if (entry < this.#limit) {
      this.#counter.set(identity, entry + 1);
      return true;
    }

    return false;
  }
}
