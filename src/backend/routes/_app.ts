import * as trpc from "@trpc/server";
import superjson from "superjson";
import { questionRouter } from "./question";
import { voteRouter } from "./vote";

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge("question.", questionRouter)
  .merge("vote.", voteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
