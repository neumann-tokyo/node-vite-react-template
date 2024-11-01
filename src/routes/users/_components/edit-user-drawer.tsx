import { jwtTokenAtom } from "@/atoms/current-user.ts";
import { EditUserForm } from "@/components/edit-user-form.tsx";
import { ErrorAlert } from "@/components/error-alert.tsx";
import { Trans } from "@/components/trans.tsx";
import { httpClient } from "@/libs/http-client.ts";
import type { User } from "@/types.ts";
import {
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Else, If, Then } from "react-if";

export function EditUserDrawer({
	isOpen,
	onClose,
	user,
}: {
	isOpen: boolean;
	onClose: () => void;
	user: User;
}) {
	const queryClient = useQueryClient();
	const [jwtToken] = useAtom(jwtTokenAtom);
	const { mutate, isPending, isError } = useMutation({
		mutationKey: ["update-user"],
		mutationFn: (data: {
			userId: number;
			email: string;
			password?: string;
			displayName: string;
			language: string;
			timezone: string;
			datetimeFormat: string;
		}) => {
			return httpClient({
				jwtToken,
			})
				.post(`users/${data.userId}/update`, { json: data })
				.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			onClose();
		},
	});

	const onSubmit = (e: any) => {
		e.preventDefault();

		mutate({
			userId: user.id,
			email: e.target.email.value,
			password: e.target.password?.value,
			displayName: e.target.displayName.value,
			language: e.target.language.value,
			timezone: e.target.timezone.value,
			datetimeFormat: e.target.datetimeFormat.value,
		});
	};

	return (
		<Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>
					<Trans>Edit User</Trans>
				</DrawerHeader>

				<DrawerBody>
					<If condition={isError}>
						<Then>
							<ErrorAlert title="Fail to save" />
						</Then>
						<Else>
							<EditUserForm
								onSubmit={onSubmit}
								user={user}
								isLoading={isPending}
								onBack={onClose}
							/>
						</Else>
					</If>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
}
