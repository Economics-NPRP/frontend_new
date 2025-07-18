'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext, useState } from 'react';

import { ArrayQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getAllSubsectorsBySector } from '@/lib/sector';
import { ISubsectorData, SectorType } from '@/schema/models';
import { ArrayContextState, getDefaultArrayContextState } from '@/types';

export interface IAllSubsectorsBySectorContext extends ArrayContextState<ISubsectorData> {
	sector: SectorType;
	setSector: (value: SectorType) => void;
}
const DefaultData = {
	...getDefaultArrayContextState<ISubsectorData>(),

	sector: 'energy' as SectorType,
	setSector: () => {},
};
const Context = createContext<IAllSubsectorsBySectorContext>(DefaultData);

export const AllSubsectorsBySectorProvider = ({ children }: PropsWithChildren) => {
	const { sector: paramsSector } = useParams();

	const [sector, setSector] = useState<SectorType>(
		(paramsSector || DefaultData.sector) as SectorType,
	);

	return (
		<ArrayQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['allSubsectorsBySector']}
			queryFn={() => () =>
				throwError(getAllSubsectorsBySector(sector), 'getAllSubsectorsBySector')
			}
			children={children}
			sector={sector}
			setSector={setSector}
		/>
	);
};

export {
	DefaultData as DefaultAllSubsectorsBySectorContextData,
	Context as AllSubsectorsBySectorContext,
};
