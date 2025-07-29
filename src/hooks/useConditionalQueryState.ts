'use client';

import { ParserBuilder, useQueryState, useQueryStates } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocalStorage } from '@mantine/hooks';

interface CoreOptions<T> {
	defaultValue: T;
	syncWithSearchParams?: boolean;
	onValueChange?: (value: T) => void;
}

export type UseConditionalQueryStateOptions<T> = {
	key: string;
	parser: ParserBuilder<T>;
	saveToLocalStorage?: boolean;
	localStorageKey?: string;
} & CoreOptions<T>;
export type UseConditionalQueryStateSignature = <T>(
	options: UseConditionalQueryStateOptions<T>,
) => [T, (value: T) => void];
export const useConditionalQueryState: UseConditionalQueryStateSignature = <T>({
	key,
	defaultValue,
	parser,
	syncWithSearchParams = false,
	saveToLocalStorage = false,
	localStorageKey = key,
	onValueChange,
}: UseConditionalQueryStateOptions<T>) => {
	const [value, setValue] = useState<T>(defaultValue);
	const [queryValue, setQueryValue] = useQueryState<T>(
		key,
		defaultValue ? parser.withDefault(defaultValue) : parser,
	);
	const [localStorageValue, setLocalStorageValue] = useLocalStorage<T>({
		key: localStorageKey,
		defaultValue: defaultValue,
	});

	const memoizedValue = useMemo<T>(
		() => (syncWithSearchParams ? queryValue : value) as T,
		[syncWithSearchParams, queryValue, value],
	);

	const handleSetValue = useCallback(
		(value: T) => {
			if (syncWithSearchParams) setQueryValue(value as any);
			setValue(value as T);

			if (saveToLocalStorage) setLocalStorageValue(value);
			if (onValueChange) onValueChange(value as T);
		},
		[syncWithSearchParams],
	);

	useEffect(() => {
		if (!saveToLocalStorage) return;
		if (localStorageValue === memoizedValue) return;

		//	If current value hasn't changed (i.e default), update it using local storage value
		if (
			memoizedValue === defaultValue &&
			localStorageValue !== null &&
			localStorageValue !== undefined
		) {
			if (syncWithSearchParams) setQueryValue(localStorageValue as any);
			setValue(localStorageValue as T);
		}
	}, [
		saveToLocalStorage,
		localStorageValue,
		memoizedValue,
		defaultValue,
		setQueryValue,
		setValue,
		syncWithSearchParams,
	]);

	return [memoizedValue, handleSetValue];
};

export type UseConditionalQueryStatesOptions<T extends Record<string, any>> = {} & Record<
	keyof T,
	ParserBuilder<any>
> &
	CoreOptions<T>;
export type UseConditionalQueryStatesSignature = <T extends Record<string, any>>(
	options: UseConditionalQueryStatesOptions<T>,
) => [T, (value: T) => void];
export const useConditionalQueryStates: UseConditionalQueryStatesSignature = <
	T extends Record<string, any>,
>({
	defaultValue,
	syncWithSearchParams = false,
	onValueChange,
	...states
}: UseConditionalQueryStatesOptions<T>) => {
	const [value, setValue] = useState<T>(defaultValue || {});
	const [queryValue, setQueryValue] = useQueryStates<Record<string, ParserBuilder<any>>>(
		Object.entries(states).reduce(
			(acc, [key, parser]) => ({
				...acc,
				[key]: defaultValue ? parser.withDefault(defaultValue[key]) : parser,
			}),
			{},
		),
	);

	const memoizedValue = useMemo<T>(
		() => (syncWithSearchParams ? queryValue : value) as T,
		[syncWithSearchParams, queryValue, value],
	);

	const handleSetValue = useCallback(
		(value: T) => {
			if (syncWithSearchParams) setQueryValue(value as any);
			setValue(value as T);

			if (onValueChange) onValueChange(value as T);
		},
		[syncWithSearchParams],
	);

	return [memoizedValue, handleSetValue];
};
