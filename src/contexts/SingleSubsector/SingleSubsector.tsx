'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { PropsWithChildren, createContext, useMemo } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSingleSubsector } from '@/lib/subsectors';
import { DefaultSubsectorData, ISubsectorData } from '@/schema/models';
import { ServerContextState, getDefaultContextState } from '@/types';

export interface ISingleSubsectorContext extends ServerContextState<ISubsectorData> {}
const DefaultData = getDefaultContextState(DefaultSubsectorData);
const Context = createContext<ISingleSubsectorContext>(DefaultData);

export interface SingleCycleProviderProps extends PropsWithChildren {
	idSource?: 'route' | 'searchParams';
}
export const SingleSubsectorProvider = ({
	idSource = 'route',
	children,
}: SingleCycleProviderProps) => {
	const params = useParams();
	const searchParams = useSearchParams();

	const subsector = useMemo(() => {
		if (idSource === 'route') return params.subsector;
		if (idSource === 'searchParams') return searchParams.get('subsector');
		return null;
	}, [idSource, params, searchParams]);

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={[subsector as string, 'singleSubsector']}
			queryFn={() => () =>
				throwError(
					getSingleSubsector(subsector as string),
					`getSingleSubsector:${subsector}`,
				)
			}
			children={children}
		/>
	);
};

export { DefaultData as DefaultSingleSubsectorContextData, Context as SingleSubsectorContext };
