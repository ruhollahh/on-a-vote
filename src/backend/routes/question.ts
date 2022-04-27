import { createQuestionValidator } from "@/shared/createQuestionValidator";
import { z } from "zod";
import { createRouter } from "../createRouter";
import * as trpc from "@trpc/server";

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
        throw new trpc.TRPCError({ code: "NOT_FOUND" });
      }
      let userVote = null;
      if (ctx.session) {
        userVote = await ctx.prisma.vote.findUnique({
          where: {
            questionId_userId: {
              questionId: question.id,
              userId: ctx.session.userId,
            },
          },
        });
      }
      const isOwner = question.userId === ctx.session?.userId;
      return {
        ...question,
        userVote,
        isOwner,
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
  })
  .mutation("vote", {
    input: z.object({
      questionId: z.string().cuid(),
      optionId: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.session) {
        throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
      }
      return await ctx.prisma.vote.create({
        data: {
          question: {
            connect: {
              id: input.questionId,
            },
          },
          user: {
            connect: {
              id: ctx.session.userId,
            },
          },
          option: {
            connect: {
              id: input.optionId,
            },
          },
        },
      });
    },
  });
