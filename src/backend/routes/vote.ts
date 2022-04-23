import * as trpc from "@trpc/server";
import { prisma } from "@/backend/utils/prisma";
import { z } from "zod";

export const voteRouter = trpc.router().mutation("create", {
  input: z.object({
    questionId: z.string().cuid(),
    optionId: z.string().cuid(),
  }),
  async resolve({ input: { questionId, optionId } }) {
    return await prisma.vote.create({
      data: {
        question: {
          connect: {
            id: questionId,
          },
        },
        option: {
          connect: {
            id: optionId,
          },
        },
      },
    });
  },
});
