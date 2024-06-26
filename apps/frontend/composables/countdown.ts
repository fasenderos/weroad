import {
	type Duration,
	differenceInSeconds,
	intervalToDuration,
} from "date-fns";
import { onMounted, onUnmounted, ref } from "vue";

export const useCountdown = (initialExpiresAt: Date, callback?: () => void) => {
	const countdown = ref<Duration | null>(null);
	let intervalId: NodeJS.Timeout;

	const calculateTimeLeft = (expiresAt: Date) => {
		const now = new Date();
		const secondsLeft = Math.max(
			0,
			differenceInSeconds(new Date(expiresAt), now),
		);
		return intervalToDuration({
			start: now,
			end: new Date(now.getTime() + secondsLeft * 1000),
		});
	};

	const startCountdown = (expiresAt: Date) => {
		if (intervalId) {
			clearInterval(intervalId);
		}
		countdown.value = calculateTimeLeft(expiresAt);
		intervalId = setInterval(() => {
			countdown.value = calculateTimeLeft(expiresAt);
			if (differenceInSeconds(expiresAt, new Date()) <= 0) {
				clearInterval(intervalId);
				if (typeof callback === "function") callback();
			}
		}, 1000);
	};

	const resetCountdown = (newExpiresAt: Date) => {
		startCountdown(newExpiresAt);
	};

	onMounted(() => {
		startCountdown(initialExpiresAt);
	});

	onUnmounted(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});

	return {
		countdown,
		resetCountdown,
	};
};
