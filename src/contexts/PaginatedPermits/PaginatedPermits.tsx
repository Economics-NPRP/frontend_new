'use client';

import { createContext, useContext } from 'react';

import { MyUserProfileContext, SortedOffsetPaginatedQueryProvider } from '@/contexts';
// import { getPaginatedPermits } from '@/lib/permits';
import { IPermitData } from '@/schema/models';
import {
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
	getDefaultSortedOffsetPaginatedContextState,
} from '@/types';

export interface IPaginatedPermitsContext extends SortedOffsetPaginatedContextState<IPermitData> {}
const DefaultData = getDefaultSortedOffsetPaginatedContextState<IPermitData>();
const Context = createContext<IPaginatedPermitsContext>(DefaultData);

export const PaginatedPermitsProvider = ({
	id = 'paginatedPermits',
	...props
}: SortedOffsetPaginatedProviderProps) => {
	const myUser = useContext(MyUserProfileContext);

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
		/>
	);
};

export { DefaultData as DefaultPaginatedPermitsContextData, Context as PaginatedPermitsContext };
