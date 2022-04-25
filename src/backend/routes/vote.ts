import { z } from "zod";
import { createRouter } from "../createRouter";

export const voteRouter = createRouter().mutation("create", {
  input: z.object({
    questionId: z.string().cuid(),
    optionId: z.string().cuid(),
  }),
  async resolve({ ctx, input: { questionId, optionId } }) {
    return await ctx.prisma.vote.create({
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
        user: {
          connect: {
            id: ctx.session?.userId,
          },
        },
      },
    });
  },
});
