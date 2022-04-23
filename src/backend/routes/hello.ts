import * as trpc from "@trpc/server";
import { z } from "zod";

export const helloRouter = trpc.router().query("sayit", {
  input: z
    .object({
      text: z.string().nullish(),
    })
    .nullish(),
  resolve({ input }) {
    return {
      greeting: `hello ${input?.text ?? "world"}`,
    };
  },
});
