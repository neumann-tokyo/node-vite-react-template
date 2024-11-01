import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	FormControl,
	Heading,
	Input,
	Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { useState } from "react";
import { When } from "react-if";
import { jwtTokenAtom } from "../atoms/current-user.ts";
import { httpClient } from "../libs/http-client.ts";

export function SignInPage() {
	const [signInError, setSignInError] = useState(false);
	const [_, setJwtToken] = useAtom(jwtTokenAtom);
	const { mutate, isPending } = useMutation({
		mutationKey: ["sign-in"],
		mutationFn: (data: { email: string; password: string }) => {
			return httpClient().post("users/sign_in", { json: data }).json();
		},
		onSuccess: (res: any) => {
			const token = res.token;
			Cookies.set("jwt-token", token);
			setJwtToken(token);
		},
		onError: (error) => {
			console.error(error);
			setSignInError(true);
		},
	});

	const onSubmit = (e: any) => {
		e.preventDefault();
		setSignInError(false);
		mutate({
			email: e.target.email?.value,
			password: e.target.password?.value,
		});
	};

	return (
		<>
			<Heading as="h1" size="2xl">
				Deno React Template
			</Heading>
			<Card variant="outline" width="100%" maxWidth="400px">
				<CardHeader>
					<Heading as="h2" size="xl">
						Sign In
					</Heading>
				</CardHeader>

				<CardBody>
					<form onSubmit={onSubmit}>
						<Flex flexDirection="column" gap="1rem">
							<FormControl>
								<FormControl>Email</FormControl>
								<Input
									type="email"
									name="email"
									placeholder="Email"
									required={true}
								/>
							</FormControl>
							<FormControl>
								<FormControl>Password</FormControl>
								<Input
									type="password"
									name="password"
									placeholder="Password"
									required={true}
								/>
							</FormControl>
							<When condition={signInError}>
								<Text color="tomato">Invalid Email or Password</Text>
							</When>
							<Button type="submit" colorScheme="blue" isLoading={isPending}>
								Sign In
							</Button>
						</Flex>
					</form>
				</CardBody>
			</Card>
		</>
	);
}
