'use client';

import { useParams } from 'next/navigation';
import { PropsWithChildren, createContext } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSingleFirm } from '@/lib/users/firms';
import { DefaultFirmData, IFirmData } from '@/schema/models';
import { ServerContextState, getDefaultContextState } from '@/types';

export interface ISingleFirmContext extends ServerContextState<IFirmData> {}
const DefaultData = getDefaultContextState(DefaultFirmData);
const Context = createContext<ISingleFirmContext>(DefaultData);

export const SingleFirmProvider = ({ children }: PropsWithChildren) => {
	const { firmId } = useParams();
	console.log(firmId);

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['users', 'firms', firmId as string, 'singleFirm']}
			queryFn={() => () => throwError(getSingleFirm(firmId as string))}
			children={children}
		/>
	);
};

export { DefaultData as DefaultSingleFirmContextData, Context as SingleFirmContext };
