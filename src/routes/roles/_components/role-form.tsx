import { jwtTokenAtom } from "@/atoms/current-user.ts";
import { ErrorAlert } from "@/components/error-alert.tsx";
import { SuccessAlert } from "@/components/success-alert.tsx";
import { Trans } from "@/components/trans.tsx";
import { httpClient } from "@/libs/http-client.ts";
import type { Role } from "@/types.ts";
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Case, Switch } from "react-if";

export function RoleForm({
	role,
	afterSubmit,
}: { role?: Role; afterSubmit?: () => void }) {
	const [jwtToken] = useAtom(jwtTokenAtom);
	const queryClient = useQueryClient();
	const { mutate, isPending, isSuccess, isError } = useMutation({
		mutationFn: async (data: {
			identifier: string;
			displayName: string;
			description: string;
			displayOrder: number;
		}) => {
			if (role) {
				const { identifier, ...body } = data;
				return await httpClient({ jwtToken })
					.post(`roles/${identifier}/update`, { json: body })
					.json();
			}

			return await httpClient({ jwtToken })
				.post("roles", { json: data })
				.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
	});

	const onSubmit = (e: any) => {
		e.preventDefault();

		mutate({
			identifier: e.target.identifier.value,
			displayName: e.target.displayName.value,
			description: e.target.description.value,
			displayOrder: Number(e.target.displayOrder.value),
		});

		if (afterSubmit) {
			afterSubmit();
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<Flex flexDirection="column" gap="1rem">
				<Switch>
					<Case condition={isSuccess}>
						<SuccessAlert title="Success!" />
					</Case>
					<Case condition={isError}>
						<ErrorAlert title="Fail!" />
					</Case>
				</Switch>
				<FormControl>
					<FormLabel>
						<Trans>Identifier</Trans>
					</FormLabel>
					<Input
						name="identifier"
						defaultValue={role?.identifier}
						minLength={1}
						maxLength={100}
						required
						isDisabled={!!role?.identifier}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>
						<Trans>Display Name</Trans>
					</FormLabel>
					<Input
						name="displayName"
						defaultValue={role?.displayName}
						minLength={1}
						maxLength={100}
						required
					/>
				</FormControl>
				<FormControl>
					<FormLabel>
						<Trans>Description</Trans>
					</FormLabel>
					<Input
						name="description"
						defaultValue={role?.description}
						minLength={1}
						maxLength={500}
						required
					/>
				</FormControl>
				<FormControl>
					<FormLabel>
						<Trans>Display Order</Trans>
					</FormLabel>
					<NumberInput
						name="displayOrder"
						defaultValue={role?.displayOrder}
						min={0}
						isRequired={true}
					>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</FormControl>
				<Flex gap="0.5rem">
					<Button colorScheme="blue" type="submit" isLoading={isPending}>
						Save
					</Button>
				</Flex>
			</Flex>
		</form>
	);
}
