import type { DeepReadonly } from "vue";

const myUseState = <T>(
	initialState?: T,
): [Readonly<Ref<DeepReadonly<T>>>, (newState: T) => void] => {
	const state = ref<T | undefined>(initialState) as Ref<T>;
	const setState = (newState: T) => {
		state.value = newState;
	};

	return [readonly(state), setState];
};

export { myUseState };
