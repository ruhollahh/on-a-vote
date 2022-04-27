import superjson from "superjson";
import { createRouter } from "../createRouter";
import { authRouter } from "./auth";
import { questionRouter } from "./question";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("question.", questionRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
