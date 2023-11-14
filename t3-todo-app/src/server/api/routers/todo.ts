import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.todo.findMany();
  }),

  create: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          title: input.title,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          isDone: z.boolean().optional(),
          text: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.update({
        where: { id: input.id },
        data: input.data,
      });
      return todo;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const todo = await ctx.db.todo.delete({
        where: { id: input.id },
      });
      return todo;
    }),
});
