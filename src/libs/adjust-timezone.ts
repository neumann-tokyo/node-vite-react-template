import { currentUserAtom } from "@/atoms/current-user.ts";
import { useAtomValue } from "jotai";
import spacetime from "spacetime";

export function useAdjustTimezone() {
	const currentUser = useAtomValue(currentUserAtom);
	return (datetime: string | Date | number) => {
		return spacetime(datetime)
			.goto(currentUser?.timezone ?? "Asia/Tokyo")
			.format("iso-utc");
	};
}
