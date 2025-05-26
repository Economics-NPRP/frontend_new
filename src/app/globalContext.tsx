'use client';

import { ComponentPropsWithRef, createContext } from 'react';

import { throwError } from '@/helpers';
import { getMyProfile } from '@/lib/users/firms';
import { DefaultUserData, IUserData } from '@/schema/models';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface ICurrentUserContext {
	currentUser: IUserData;
	currentUserError: Error | null;
	isCurrentUserLoading?: boolean;
	isCurrentUserError?: boolean;
	isCurrentUserSuccess?: boolean;
}

export const CurrentUserContext = createContext<ICurrentUserContext>({
	currentUser: DefaultUserData,
	currentUserError: null,
	isCurrentUserLoading: true,
	isCurrentUserError: false,
	isCurrentUserSuccess: false,
});

export interface GlobalContextProps extends ComponentPropsWithRef<'div'> {}
export default function GlobalContext({ children }: GlobalContextProps) {
	const {
		data: userData,
		error: userDataError,
		isLoading: isUserDataLoading,
		isError: isUserDataError,
		isSuccess: isUserDataSuccess,
	} = useQuery({
		queryKey: ['users', 'firms', 'mine'],
		queryFn: () => throwError(getMyProfile()),
		placeholderData: keepPreviousData,
	});

	return (
		<CurrentUserContext.Provider
			value={{
				currentUser: userData || DefaultUserData,
				currentUserError: userDataError,
				isCurrentUserLoading: isUserDataLoading,
				isCurrentUserError: isUserDataError,
				isCurrentUserSuccess: isUserDataSuccess,
			}}
		>
			{children}
		</CurrentUserContext.Provider>
	);
}
