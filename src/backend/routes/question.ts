import * as trpc from "@trpc/server";
import { prisma } from "@/backend/utils/prisma";

export const questionRouter = trpc.router().query("getAll", {
  async resolve() {
    return await prisma.pollQuestion.findMany();
  },
});
