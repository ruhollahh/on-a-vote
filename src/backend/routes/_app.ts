import superjson from "superjson";
import { createRouter } from "../createRouter";
import { nextAuthRouter } from "./nextAuth";
import { questionRouter } from "./question";
import { voteRouter } from "./vote";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("question.", questionRouter)
  .merge("vote.", voteRouter)
  .merge("next-auth.", nextAuthRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
