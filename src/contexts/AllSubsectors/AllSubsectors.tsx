'use client';

import { createContext } from 'react';

import { ArrayQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getAllSubsectors } from '@/lib/sector';
import { ISectorData } from '@/schema/models';
import { ArrayContextState, CoreProviderProps, getDefaultArrayContextState } from '@/types';

export interface IAllSubsectorsContext extends ArrayContextState<ISectorData> {}
const DefaultData = getDefaultArrayContextState<ISectorData>();
const Context = createContext<IAllSubsectorsContext>(DefaultData);

export const AllSubsectorsProvider = ({ id = 'allSubsectors', ...props }: CoreProviderProps) => {
	return (
		<ArrayQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['allSubsectors']}
			queryFn={() => () => throwError(getAllSubsectors(), 'getAllSubsectors')}
			id={id}
			{...props}
		/>
	);
};

export { DefaultData as DefaultAllSubsectorsContextData, Context as AllSubsectorsContext };
