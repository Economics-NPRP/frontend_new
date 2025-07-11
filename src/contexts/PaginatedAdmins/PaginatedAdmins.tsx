'use client';

import { createContext } from 'react';

import { SortedOffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedAdmins } from '@/lib/users/admins';
import { IAdminData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedAdminsContext extends SortedOffsetPaginatedContextState<IAdminData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IAdminData>(
	1,
	20,
	'created_at',
	'desc',
);
const Context = createContext<IPaginatedAdminsContext>(DefaultData);

export const PaginatedAdminsProvider = ({
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
			queryKey={['dashboard', 'admin', 'paginatedAdmins']}
			queryFn={(page, perPage, sortBy, sortDirection) => () =>
				throwError(
					getPaginatedAdmins({
						page,
						perPage,
						sortBy,
						sortDirection,
					}),
					'getPaginatedAdmins',
				)
			}
			children={children}
		/>
	);
};

export { DefaultData as DefaultPaginatedAdminsContextData, Context as PaginatedAdminsContext };
