'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { PropsWithChildren, createContext, useMemo } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSingleCycle } from '@/lib/cycles';
import { DefaultAuctionCycleData, IAuctionCycleData } from '@/schema/models';
import { CoreProviderProps, ServerContextState, getDefaultContextState } from '@/types';

export interface ISingleCycleContext extends ServerContextState<IAuctionCycleData> {}
const DefaultData = getDefaultContextState(DefaultAuctionCycleData);
const Context = createContext<ISingleCycleContext>(DefaultData);

export interface SingleCycleProviderProps extends PropsWithChildren {
	idSource?: 'route' | 'searchParams';
}
export const SingleCycleProvider = ({
	idSource = 'route',
	id = 'singleCycle',
	...props
}: CoreProviderProps) => {
	const params = useParams();
	const searchParams = useSearchParams();

	const cycleId = useMemo(() => {
		if (idSource === 'route') return params.cycleId;
		if (idSource === 'searchParams') return searchParams.get('cycleId');
		return null;
	}, [idSource, params, searchParams]);

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['dashboard', 'admin', cycleId as string, 'singleCycle']}
			queryFn={() => () =>
				throwError(getSingleCycle(cycleId as string), `getSingleCycle:${cycleId}`)
			}
			id={id}
			disabled={!cycleId}
			{...props}
		/>
	);
};

export { DefaultData as DefaultSingleCycleContextData, Context as SingleCycleContext };
