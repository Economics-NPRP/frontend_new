'use client';

import { createContext, useCallback, useMemo, useState } from 'react';

import {
	SortedOffsetPaginatedQueryProvider,
	SortedOffsetPaginatedQueryProviderProps,
} from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedAdmins } from '@/lib/users/admins';
import { IAdminData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedAdminsContext extends SortedOffsetPaginatedContextState<IAdminData> {
	excludeIds: Array<string>;
	setAllExcludeIds: (excludeIds: Array<string>) => void;
	addToExcludeIds: (...excludeIds: Array<string>) => void;
	removeFromExcludeIds: (...excludeIds: Array<string>) => void;
}
const DefaultData: IPaginatedAdminsContext = {
	...getDefaultSortedOffsetPaginatedContextState<IAdminData>(1, 20, 'created_at', 'desc'),

	excludeIds: [],
	setAllExcludeIds: () => {},
	addToExcludeIds: () => {},
	removeFromExcludeIds: () => {},
};
const Context = createContext<IPaginatedAdminsContext>(DefaultData);

export interface PaginatedAdminsProviderProps extends SortedOffsetPaginatedProviderProps {
	defaultExcludeIds?: Array<string>;
}
export const PaginatedAdminsProvider = ({
	defaultExcludeIds,
	...props
}: PaginatedAdminsProviderProps) => {
	const [excludeIds, setAllExcludeIds] = useState(defaultExcludeIds || DefaultData.excludeIds);

	const addToExcludeIds = useCallback<IPaginatedAdminsContext['addToExcludeIds']>(
		(...excludeIds) => {
			setAllExcludeIds((previous) => [...previous, ...excludeIds]);
		},
		[],
	);

	const removeFromExcludeIds = useCallback<IPaginatedAdminsContext['removeFromExcludeIds']>(
		(...excludeIds) => {
			setAllExcludeIds((previous) => previous.filter((id) => !excludeIds.includes(id)));
		},
		[],
	);

	const queryKey = useMemo(
		() => ['dashboard', 'admin', 'paginatedAdmins', excludeIds.toSorted().join(',')],
		[excludeIds],
	);
	const queryFn = useMemo<
		SortedOffsetPaginatedQueryProviderProps<IPaginatedAdminsContext>['queryFn']
	>(
		() => (page, perPage, sortBy, sortDirection) => () =>
			throwError(
				getPaginatedAdmins({
					page,
					perPage,
					sortBy,
					sortDirection,
					excludeIds,
				}),
				'getPaginatedAdmins',
			),
		[excludeIds],
	);

	return (
		<SortedOffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id="paginatedAdmins"
			excludeIds={excludeIds}
			setAllExcludeIds={setAllExcludeIds}
			addToExcludeIds={addToExcludeIds}
			removeFromExcludeIds={removeFromExcludeIds}
			{...props}
		/>
	);
};

export { DefaultData as DefaultPaginatedAdminsContextData, Context as PaginatedAdminsContext };
