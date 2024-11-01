import { jwtTokenAtom } from "@/atoms/current-user.ts";
import { ErrorAlert } from "@/components/error-alert.tsx";
import { Trans } from "@/components/trans.tsx";
import { httpClient } from "@/libs/http-client.ts";
import type { Role } from "@/types.ts";
import {
	Flex,
	Heading,
	Icon,
	IconButton,
	Spinner,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useDisclosure,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { MdAddCircleOutline } from "react-icons/md";
import { Case, Default, Switch } from "react-if";
import { RoleNewDrawer } from "./_components/role-new-drawer.tsx";
import { RolePermissions } from "./_components/role-permissions.tsx";

export function RolesIndexPage() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [jwtToken] = useAtom(jwtTokenAtom);
	const {
		data: roleData,
		isPending,
		isError,
	} = useQuery<Role[]>({
		queryKey: ["roles"],
		queryFn: async () => await httpClient({ jwtToken }).get("roles").json(),
	});

	return (
		<Flex flexDirection="column">
			<Heading as="h1">
				<Trans>Roles and Permissions</Trans>
			</Heading>
			<Switch>
				<Case condition={isPending}>
					<Spinner />
				</Case>
				<Case condition={isError}>
					<ErrorAlert title="Fail to load data" />
				</Case>
				<Default>
					<Tabs>
						<Flex alignItems="center">
							<TabList>
								{roleData?.map((role) => (
									<Tab key={role.identifier}>{role.displayName}</Tab>
								))}
							</TabList>
							<IconButton
								colorScheme="blue"
								aria-label="add role"
								size="sm"
								icon={<Icon as={MdAddCircleOutline} boxSize={6} />}
								onClick={onOpen}
							/>
						</Flex>

						<TabPanels>
							{roleData?.map((role) => (
								<TabPanel key={role.identifier}>
									<RolePermissions role={role} />
								</TabPanel>
							))}
						</TabPanels>
					</Tabs>
				</Default>
			</Switch>
			<RoleNewDrawer isOpen={isOpen} onClose={onClose} />
		</Flex>
	);
}
