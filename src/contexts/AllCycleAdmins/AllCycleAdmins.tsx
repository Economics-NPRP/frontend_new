'use client';

import { useParams } from 'next/navigation';
import { createContext } from 'react';

import { ArrayQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getAllCycleAdmins } from '@/lib/cycles';
import { ICycleAdminData } from '@/schema/models/CycleAdminData';
import { ArrayContextState, CoreProviderProps, getDefaultArrayContextState } from '@/types';

export interface IAllCycleAdminsContext extends ArrayContextState<ICycleAdminData> {}
const DefaultData = getDefaultArrayContextState<ICycleAdminData>();
const Context = createContext<IAllCycleAdminsContext>(DefaultData);

export const AllCycleAdminsProvider = ({ id = 'allCycleAdmins', ...props }: CoreProviderProps) => {
	const { cycleId } = useParams();

	return (
		<ArrayQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['dashboard', 'admin', cycleId as string, 'allCycleAdmins']}
			queryFn={() => () =>
				throwError(getAllCycleAdmins(cycleId as string), `getAllCycleAdmins:${cycleId}`)
			}
			id={id}
			{...props}
		/>
	);
};

export { DefaultData as DefaultAllCycleAdminsContextData, Context as AllCycleAdminsContext };
