import './App.css';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils/trpc';
import Test from './components/Test';

function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				// httpBachLink: batch multiple requests
				// httpLink: send requests one by one
				httpBatchLink({
					url: 'http://localhost:3000/trpc',
					headers() {
						return {
							Authorization: 'authorizationHeader',
						};
					},
				}),
			],
		})
	);

	return (
		<>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<Test />
				</QueryClientProvider>
			</trpc.Provider>
		</>
	);
}

export default App;
