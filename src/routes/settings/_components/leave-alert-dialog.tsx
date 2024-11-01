import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	Flex,
	useDisclosure,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useRef } from "react";
import { useLocation } from "wouter";
import { jwtTokenAtom, signOutAtom } from "../../../atoms/current-user.ts";
import { Trans } from "../../../components/trans.tsx";
import { httpClient } from "../../../libs/http-client.ts";

export function LeaveAlertDialog() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);
	const [jwtToken] = useAtom(jwtTokenAtom);
	const [_, navigate] = useLocation();
	const signOut = useSetAtom(signOutAtom);
	const { mutate, isPending } = useMutation({
		mutationKey: ["leave-user"],
		mutationFn: () =>
			httpClient({
				jwtToken,
			})
				.post("users/leave")
				.json(),
		onSuccess: () => {
			signOut(null);
			navigate("/");
		},
		onError: (error) => {
			alert(error);
		},
	});

	return (
		<>
			<Button colorScheme="red" onClick={onOpen}>
				<Trans>Leave the system</Trans>
			</Button>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							<Trans>Leave the system</Trans>
						</AlertDialogHeader>

						<AlertDialogBody>
							<Trans>
								Are you sure? You can't undo this action afterwards.
							</Trans>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Flex gap="0.5rem">
								<Button
									colorScheme="red"
									ml={3}
									onClick={() => mutate()}
									isLoading={isPending}
								>
									<Trans>Leave</Trans>
								</Button>
								<Button ref={cancelRef} onClick={onClose}>
									<Trans>Cancel</Trans>
								</Button>
							</Flex>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
