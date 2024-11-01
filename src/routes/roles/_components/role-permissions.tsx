import {
	Flex,
	Grid,
	GridItem,
	Heading,
	Spinner,
	Switch as SwitchUI,
	Text,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { Case, Default, Switch } from "react-if";
import { jwtTokenAtom } from "../../../atoms/current-user.ts";
import { ErrorAlert } from "../../../components/error-alert.tsx";
import { Trans } from "../../../components/trans.tsx";
import { httpClient } from "../../../libs/http-client.ts";
import type { Permission, Role } from "../../../types.ts";
import { RoleForm } from "./role-form.tsx";

export function RolePermissions({ role }: { role: Role }) {
	const [jwtToken] = useAtom(jwtTokenAtom);
	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ["roles", role.identifier],
		queryFn: async () =>
			await httpClient({ jwtToken }).get(`roles/${role.identifier}`).json(),
	});
	const {
		data: permissionsData,
		isPending: permissionsIsPending,
		isError: permissionsIsError,
	} = useQuery({
		queryKey: ["permissions"],
		queryFn: async () =>
			await httpClient({ jwtToken }).get("permissions").json(),
	});

	const havingPermissionIdentifiers = useMemo<string[]>(
		() =>
			(data as any)?.permissions?.map((p: Permission) => p.identifier) || [],
		[data],
	);
	const queryClient = useQueryClient();
	const { mutate, status: editPermissionStatus } = useMutation({
		mutationKey: ["edit-permission"],
		mutationFn: async (data: {
			permissionIdentifier: string;
			remove: boolean;
		}) =>
			await httpClient({
				jwtToken,
			})
				.post(`roles/${role.identifier}/edit_permission`, {
					json: {
						permissionIdentifier: data.permissionIdentifier,
						remove: data.remove,
					},
				})
				.json(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["current-user"] });
			refetch();
		},
	});

	return (
		<Flex flexDirection="column">
			<Heading as="h2">{role.displayName}</Heading>
			<Flex flexDirection="column">
				<Heading as="h3">
					<Trans>Roles Settings</Trans>
				</Heading>
				<RoleForm role={role} />
			</Flex>
			<Flex flexDirection="column">
				<Heading as="h3">
					<Trans>Permissions Settings</Trans>
				</Heading>
				<Switch>
					<Case condition={isPending || permissionsIsPending}>
						<Spinner />
					</Case>
					<Case condition={isError || permissionsIsError}>
						<ErrorAlert title="Fail to load data" />
					</Case>
					<Default>
						<Flex flexDirection="column" gap="1rem">
							{(permissionsData as Permission[])?.map((permission) => (
								<Grid
									key={permission.identifier}
									templateRows="repeat(2, 1fr)"
									templateColumns="1fr 4rem"
									alignItems="center"
								>
									<GridItem>
										<Text fontSize="lg">{permission.displayName}</Text>
									</GridItem>
									<GridItem justifySelf="end">
										<SwitchUI
											defaultChecked={havingPermissionIdentifiers.includes(
												permission.identifier,
											)}
											onChange={(e) => {
												e.preventDefault();
												mutate({
													permissionIdentifier: permission.identifier,
													remove: !e.target.checked,
												});
											}}
											isDisabled={editPermissionStatus === "pending"}
										/>
									</GridItem>
									<GridItem colSpan={2}>{permission.description}</GridItem>
								</Grid>
							))}
						</Flex>
					</Default>
				</Switch>
			</Flex>
		</Flex>
	);
}
