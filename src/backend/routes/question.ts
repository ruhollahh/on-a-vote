import * as trpc from "@trpc/server";
import { prisma } from "@/backend/utils/prisma";
import { tuple, z } from "zod";

export const questionRouter = trpc
  .router()
  .query("getAll", {
    async resolve() {
      return await prisma.question.findMany();
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.question.findUnique({
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
    },
  })
  .mutation("create", {
    input: z.object({
      body: z.string().min(5).max(600),
      options: z.array(z.string()),
    }),
    async resolve({ input }) {
      const options = input.options.map((option) => ({ body: option }));

      return await prisma.question.create({
        data: {
          body: input.body,
          options: {
            create: options,
          },
        },
      });
    },
  });
