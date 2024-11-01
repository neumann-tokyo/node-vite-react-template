import { currentUserAtom } from "@/atoms/current-user.ts";
import { japaneseMessagesAtom } from "@/atoms/i18n/japanese-messages.ts";
import type { LanguageMessage } from "@/types.ts";
import { printf } from "fast-printf";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";

const currentMessagesAtom = atom<LanguageMessage[] | null>(null);

export function Trans({
	children,
	variables,
}: { children: string; variables?: string[] }) {
	const currentUser = useAtomValue(currentUserAtom);
	const [currentMessages, setCurrentMessages] = useAtom(currentMessagesAtom);
	const japaneseMessages = useAtomValue(japaneseMessagesAtom);
	const message = useMemo(() => {
		const value = currentMessages?.find((m) => m.en === children)?.value;
		if (value) {
			if (variables) {
				return printf(value, ...variables);
			}
			return value;
		}
		return children;
	}, [currentMessages, children, variables]);

	useEffect(() => {
		if (currentUser?.language === "ja_JP") {
			setCurrentMessages(japaneseMessages);
		}
	}, [currentUser, setCurrentMessages, japaneseMessages]);

	if (!currentUser || currentUser.language === "en_US") {
		return children;
	}

	return message;
}
