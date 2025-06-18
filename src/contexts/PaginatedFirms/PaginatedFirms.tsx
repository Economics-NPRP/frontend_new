'use client';

import { createContext } from 'react';

import { SortedOffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedFirms } from '@/lib/users/firms';
import { IUserData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedFirmsContext extends SortedOffsetPaginatedContextState<IUserData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IUserData>(
	1,
	20,
	'created_at',
	'desc',
);
const Context = createContext<IPaginatedFirmsContext>(DefaultData);

export const PaginatedFirmsProvider = ({
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	children,
}: SortedOffsetPaginatedProviderProps) => {
	return (
		<SortedOffsetPaginatedQueryProvider
			defaultPage={defaultPage}
			defaultPerPage={defaultPerPage}
			defaultSortBy={defaultSortBy}
			defaultSortDirection={defaultSortDirection}
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
				)
			}
			children={children}
		/>
	);
};

export { DefaultData as DefaultPaginatedFirmsContextData, Context as PaginatedFirmsContext };
