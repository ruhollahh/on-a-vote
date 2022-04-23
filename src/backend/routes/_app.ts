import * as trpc from "@trpc/server";
import { helloRouter } from "./hello";

export const appRouter = trpc.router().merge("hello.", helloRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
