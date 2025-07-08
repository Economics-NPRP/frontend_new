'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSingleCycle } from '@/lib/cycles';
import { DefaultAuctionCycleData, IAuctionCycleData } from '@/schema/models';
import { ServerContextState, getDefaultContextState } from '@/types';

export interface ISingleCycleContext extends ServerContextState<IAuctionCycleData> {}
const DefaultData = getDefaultContextState(DefaultAuctionCycleData);
const Context = createContext<ISingleCycleContext>(DefaultData);

export const SingleCycleProvider = ({ children }: PropsWithChildren) => {
	const { cycleId } = useParams();

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['dashboard', 'admin', cycleId as string, 'singleCycle']}
			queryFn={() => () =>
				throwError(getSingleCycle(cycleId as string), `getSingleCycle:${cycleId}`)
			}
			children={children}
		/>
	);
};

export { DefaultData as DefaultSingleCycleContextData, Context as SingleCycleContext };
