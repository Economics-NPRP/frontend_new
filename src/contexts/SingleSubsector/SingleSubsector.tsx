'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { createContext, useMemo } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSingleSubsector } from '@/lib/subsectors';
import { DefaultSubsectorData, ISubsectorData } from '@/schema/models';
import { CoreProviderProps, ServerContextState, getDefaultContextState } from '@/types';

export interface ISingleSubsectorContext extends ServerContextState<ISubsectorData> {}
const DefaultData = getDefaultContextState(DefaultSubsectorData);
const Context = createContext<ISingleSubsectorContext>(DefaultData);

export interface SingleSubsectorProviderProps extends CoreProviderProps {
	idSource?: 'route' | 'searchParams';
}
export const SingleSubsectorProvider = ({
	idSource = 'route',
	id = 'singleSubsector',
	...props
}: SingleSubsectorProviderProps): JSX.Element => {
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
			id={id}
			{...props}
		/>
	);
};

export { DefaultData as DefaultSingleSubsectorContextData, Context as SingleSubsectorContext };
