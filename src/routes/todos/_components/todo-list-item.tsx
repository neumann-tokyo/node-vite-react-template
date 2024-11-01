import { Button, Flex, ListItem } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Else, If, Then } from "react-if";
import { jwtTokenAtom } from "../../../atoms/current-user.ts";
import {
	DatetimeFormat,
	FormatType,
} from "../../../components/datetime-format.tsx";
import { httpClient } from "../../../libs/http-client.ts";
import type { Todo } from "../../../types.ts";

export function TodoListItem({ todo }: { todo: Todo }) {
	const [jwtToken] = useAtom(jwtTokenAtom);
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationKey: ["done-todo"],
		mutationFn: (data: {
			id: number;
		}) => {
			return httpClient({
				jwtToken,
			})
				.post(`todos/${data.id}/finish`)
				.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const onFinish = (e: any) => {
		e.preventDefault();

		mutate({
			id: todo.id,
		});
	};

	return (
		<ListItem key={todo.id} mb="0.5rem">
			<Flex justifyContent="space-between" width="500px">
				<span>{todo.title}</span>
				<If condition={todo.finishedAt}>
					<Then>
						<DatetimeFormat formatType={FormatType.DateTime}>
							{todo.finishedAt}
						</DatetimeFormat>
					</Then>
					<Else>
						<Button
							type="button"
							size="xs"
							colorScheme="blue"
							onClick={onFinish}
							isLoading={isPending}
						>
							Done
						</Button>
					</Else>
				</If>
			</Flex>
		</ListItem>
	);
}
