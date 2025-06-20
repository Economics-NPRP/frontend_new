'use client';

import { PropsWithChildren, createContext } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getMyUserProfile } from '@/lib/users';
import { DefaultUserData, IUserData } from '@/schema/models';
import { ServerContextState, getDefaultContextState } from '@/types';

export interface IMyUserProfileContext extends ServerContextState<IUserData> {}
const DefaultData = getDefaultContextState(DefaultUserData);
const Context = createContext<IMyUserProfileContext>(DefaultData);

export const MyUserProfileProvider = ({ children }: PropsWithChildren) => {
	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['users', 'mine']}
			queryFn={() => () => throwError(getMyUserProfile())}
			children={children}
		/>
	);
};

export { DefaultData as DefaultMyUserProfileContextData, Context as MyUserProfileContext };
