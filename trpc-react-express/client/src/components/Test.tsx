import { trpc } from '../utils/trpc';

const Test = () => {
	// const helloName = trpc.helloName.useQuery({ name: 'John', age: 27 });
	const { data: todos } = trpc.todos.useQuery();

	// have access to all the queries
	const utils = trpc.useUtils();

	const addTodo = trpc.addTodo.useMutation({
		onSuccess: () => {
			utils.todos.invalidate();
		},
	});

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const name = (e.target as HTMLInputElement).value;
		if (e.key === 'Enter' && name) {
			addTodo.mutate({ name });
			(e.target as HTMLInputElement).value = '';
		}
	};

	return (
		<>
			<h1>Todo</h1>
			<div>
				<label id='name'>Add Todo:</label>
				<input name='name' onKeyDown={handleKeyDown} />
			</div>
			<ul>
				{todos?.map((todo) => (
					<li key={todo.id}>{todo.name}</li>
				))}
			</ul>
		</>
	);
};

export default Test;
