import { Flex, Heading } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { When } from "react-if";
import { useLocation } from "wouter";
import { currentUserAtom, jwtTokenAtom } from "../../atoms/current-user.ts";
import { EditUserForm } from "../../components/edit-user-form.tsx";
import { ErrorAlert } from "../../components/error-alert.tsx";
import { httpClient } from "../../libs/http-client.ts";

export function SettingsEditPage() {
	const [jwtToken] = useAtom(jwtTokenAtom);
	const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
	const [_, navigate] = useLocation();
	const { mutate, isPending, isError } = useMutation({
		mutationKey: ["update-current-user"],
		mutationFn: (data: {
			email: string;
			displayName: string;
			language: string;
			timezone: string;
			datetimeFormat: string;
		}) => {
			return httpClient({
				jwtToken,
			})
				.post("users/me/update", { json: data })
				.json();
		},
		onSuccess: (res: any) => {
			const updatedUserData = res.user || {};
			const user = {
				...currentUser,
				...updatedUserData,
			};
			setCurrentUser(user);
		},
	});

	const onSubmit = (e: any) => {
		e.preventDefault();

		mutate({
			email: e.target.email.value,
			displayName: e.target.displayName.value,
			language: e.target.language.value,
			timezone: e.target.timezone.value,
			datetimeFormat: e.target.datetimeFormat.value,
		});
	};

	return (
		<Flex flexDirection="column" gap="1rem">
			<Heading as="h1" size="4xl">
				Settings
			</Heading>
			<When condition={isError}>
				<ErrorAlert title="Fail to save" />
			</When>
			<EditUserForm
				onSubmit={onSubmit}
				user={currentUser}
				isLoading={isPending}
				onBack={() => navigate("/settings")}
			/>
		</Flex>
	);
}
