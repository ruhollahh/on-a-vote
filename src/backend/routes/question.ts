import { z } from "zod";
import { createRouter } from "../createRouter";

export const questionRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.question.findMany();
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
    input: z.object({
      body: z.string().min(5).max(600),
      options: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      const options = input.options.map((option) => ({ body: option }));

      return await ctx.prisma.question.create({
        data: {
          body: input.body,
          options: {
            create: options,
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
