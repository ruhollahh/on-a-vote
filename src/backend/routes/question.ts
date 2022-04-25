import { createQuestionValidator } from "@/shared/createQuestionValidator";
import { z } from "zod";
import { createRouter } from "../createRouter";

export const questionRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.question.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const question = await ctx.prisma.question.findUnique({
        where: {
          id: input.id,
        },
        include: {
          options: {
            include: {
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
        },
      });
      if (!question) {
        return null;
      }
      return {
        ...question,
        isOwner: question.id === ctx.session?.userId,
      };
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ ctx, input }) {
      return await ctx.prisma.question.create({
        data: {
          body: input.question,
          options: {
            create: input.options,
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
