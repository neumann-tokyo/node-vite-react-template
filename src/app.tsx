import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./layout.tsx";

const queryClient = new QueryClient();

export function App() {
	return (
		<ChakraProvider>
			<QueryClientProvider client={queryClient}>
				<Layout />
			</QueryClientProvider>
		</ChakraProvider>
	);
}
