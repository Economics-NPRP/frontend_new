'use client';

import { createContext } from 'react';

import { SortedOffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedFirms } from '@/lib/users/firms';
import { IFirmData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedFirmsContext extends SortedOffsetPaginatedContextState<IFirmData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IFirmData>(
	1,
	20,
	'created_at',
	'desc',
);
const Context = createContext<IPaginatedFirmsContext>(DefaultData);

export const PaginatedFirmsProvider = (props: SortedOffsetPaginatedProviderProps) => (
	<SortedOffsetPaginatedQueryProvider
		context={Context}
		defaultData={DefaultData}
		queryKey={['dashboard', 'admin', 'paginatedFirms']}
		queryFn={(page, perPage, sortBy, sortDirection) => () =>
			throwError(
				getPaginatedFirms({
					page,
					perPage,
					sortBy,
					sortDirection,
				}),
				'getPaginatedFirms',
			)
		}
		id="paginatedFirms"
		{...props}
	/>
);

export { DefaultData as DefaultPaginatedFirmsContextData, Context as PaginatedFirmsContext };
