import express from 'express';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = 3000;

const prisma = new PrismaClient();

// procedure can access the context
const createContext = (opts: trpcExpress.CreateExpressContextOptions) => {
	// console.log(opts.req.headers);
	return { prisma };
};

type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const appRouter = t.router({
	hello: t.procedure.query(() => 'Hello World'),
	helloName: t.procedure
		.input(z.object({ name: z.string(), age: z.number() }))
		.query(({ input }) => {
			return `Hello World, ${input.name}`;
		}),
	todos: t.procedure.query(async ({ ctx }) => {
		const todos = await ctx.prisma.todo.findMany();
		return todos;
	}),
	addTodo: t.procedure
		.input(
			z.object({
				name: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const todo = await ctx.prisma.todo.create({
				data: input,
			});
			return todo;
		}),
});

app.use(cors());

// http://localhost:3000/trpc/<ROUTE_NAME>
app.use(
	'/trpc',
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	})
);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

export type AppRouter = typeof appRouter;
