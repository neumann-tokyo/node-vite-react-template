import { jwtTokenAtom } from "@/atoms/current-user.ts";
import { ErrorAlert } from "@/components/error-alert.tsx";
import { Trans } from "@/components/trans.tsx";
import { httpClient } from "@/libs/http-client.ts";
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { When } from "react-if";
import { useLocation } from "wouter";

export function TodosNewPage() {
	const [jwtToken] = useAtom(jwtTokenAtom);
	const [_, navigate] = useLocation();
	const queryClient = useQueryClient();
	const { mutate, isPending, isError } = useMutation({
		mutationKey: ["create-todo"],
		mutationFn: async (data: {
			title: string;
		}) =>
			await httpClient({
				jwtToken,
			})
				.post("todos", { json: data })
				.json(),
		onSuccess: () => {
			navigate("/todos");
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const onSubmit = (e: any) => {
		e.preventDefault();

		mutate({ title: e.target.title.value });
	};

	return (
		<Flex flexDirection="column" gap="1rem">
			<Heading as="h1" size="4xl">
				Todo New
			</Heading>
			<When condition={isError}>
				<ErrorAlert title="Fail!" />
			</When>
			<form onSubmit={onSubmit}>
				<Flex flexDirection="column" gap="1rem">
					<FormControl>
						<FormLabel>
							<Trans>Title</Trans>
						</FormLabel>
						<Input name="title" maxLength={200} required />
					</FormControl>
					<Flex gap="0.5rem">
						<Button colorScheme="blue" type="submit" isLoading={isPending}>
							Save
						</Button>
						<Button type="button" onClick={() => navigate("/todos")}>
							<Trans>Back</Trans>
						</Button>
					</Flex>
				</Flex>
			</form>
		</Flex>
	);
}
