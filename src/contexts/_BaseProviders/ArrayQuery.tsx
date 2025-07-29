'use client';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { ArrayContextState } from '@/types';

export interface ArrayQueryProviderProps<T extends ArrayContextState<unknown>>
	extends QueryProviderProps<T>,
		Record<string, unknown> {}
export const ArrayQueryProvider = <T extends ArrayContextState<unknown>>(
	props: ArrayQueryProviderProps<T>,
) => <QueryProvider {...props} />;
