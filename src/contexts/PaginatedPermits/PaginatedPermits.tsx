'use client';

import { createContext, useContext, useState } from 'react';

import { MyUserProfileContext, SortedOffsetPaginatedQueryProvider } from '@/contexts';
// import { getPaginatedPermits } from '@/lib/permits';
import { IPermitData, PermitExpiryFilter, PermitUsageFilter } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedPermitsContext extends SortedOffsetPaginatedContextState<IPermitData> {
	usage: PermitUsageFilter;
	setUsage: (usage: PermitUsageFilter) => void;

	expiry: PermitExpiryFilter;
	setExpiry: (expiry: PermitExpiryFilter) => void;
}
const DefaultData = {
	...getDefaultSortedOffsetPaginatedContextState<IPermitData>(),

	usage: 'all' as PermitUsageFilter,
	setUsage: () => {},

	expiry: 'all' as PermitExpiryFilter,
	setExpiry: () => {},
};
const Context = createContext<IPaginatedPermitsContext>(DefaultData);

export const PaginatedPermitsProvider = ({
	id = 'paginatedPermits',
	...props
}: SortedOffsetPaginatedProviderProps) => {
	const myUser = useContext(MyUserProfileContext);

	const [usage, setUsage] = useState<PermitUsageFilter>(DefaultData.usage);
	const [expiry, setExpiry] = useState<PermitExpiryFilter>(DefaultData.expiry);

	return (
		<SortedOffsetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['dashboard', 'firm', myUser.id, 'paginatedPermits']}
			queryFn={() => () =>
				//	TODO: uncomment when backend has permits
				// queryFn={(page, perPage, sortBy, sortDirection) => () =>
				// throwError(
				// 	getPaginatedPermits({
				// 		id: myUser.id,
				// 		page,
				// 		perPage,
				// 		sortBy,
				// 		sortDirection,
				// 	}),
				// 	`getPaginatedPermits:${myUser.id}`,
				// )
				Promise.resolve(DefaultData)
			}
			id={id}
			{...props}
			usage={usage}
			setUsage={setUsage}
			expiry={expiry}
			setExpiry={setExpiry}
		/>
	);
};

export { DefaultData as DefaultPaginatedPermitsContextData, Context as PaginatedPermitsContext };
