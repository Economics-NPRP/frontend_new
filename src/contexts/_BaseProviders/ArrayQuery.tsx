'use client';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { ArrayContextState } from '@/types';

export interface ArrayQueryProviderProps<T extends ArrayContextState<unknown>>
	extends QueryProviderProps<T>,
		Record<string, unknown> {}
export const ArrayQueryProvider = <T extends ArrayContextState<unknown>>({
	context,
	defaultData,
	queryKey,
	queryFn,
	disabled,
	children,
	...props
}: ArrayQueryProviderProps<T>) => {
	return (
		<QueryProvider
			context={context}
			defaultData={defaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			disabled={disabled}
			children={children}
			{...props}
		/>
	);
};
