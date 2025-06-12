'use client';

import { PropsWithChildren, createContext } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getMyProfile } from '@/lib/users/firms';
import { DefaultUserData, IUserData } from '@/schema/models';
import { ServerContextState, getDefaultContextState } from '@/types';

export interface IMyUserContext extends ServerContextState<IUserData> {}
const DefaultData = getDefaultContextState(DefaultUserData);
const Context = createContext<IMyUserContext>(DefaultData);

export const MyUserProvider = ({ children }: PropsWithChildren) => {
	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['users', 'firms', 'mine']}
			queryFn={() => () => throwError(getMyProfile())}
			children={children}
		/>
	);
};

export { DefaultData as DefaultMyUserContextData, Context as MyUserContext };
