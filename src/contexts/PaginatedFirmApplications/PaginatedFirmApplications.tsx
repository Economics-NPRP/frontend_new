'use client';

import { createContext, useMemo, useState } from 'react';

import { FirmApplicationsFilter } from '@/components/Tables/FirmApplications';
import { KeysetPaginatedQueryProvider, KeysetPaginatedQueryProviderProps } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedApplications } from '@/lib/users/firms/applications';
import { IFirmApplication } from '@/schema/models';
import {
	KeysetPaginatedContextState,
	KeysetPaginatedProviderProps,
	getDefaultKeysetPaginatedContextState,
} from '@/types';

export interface IPaginatedFirmApplicationsContext
	extends KeysetPaginatedContextState<IFirmApplication> {
	status: FirmApplicationsFilter;
	setStatus: (status: FirmApplicationsFilter) => void;
}
const DefaultData = {
	...getDefaultKeysetPaginatedContextState<IFirmApplication>(),
	status: 'pending' as FirmApplicationsFilter,
	setStatus: () => {},
};
const Context = createContext<IPaginatedFirmApplicationsContext>(DefaultData);

export const PaginatedFirmApplicationsProvider = ({
	defaultCursor,
	defaultPerPage,
	children,
}: KeysetPaginatedProviderProps) => {
	const [status, setStatus] = useState<FirmApplicationsFilter>(DefaultData.status);

	const queryKey = useMemo(
		() => ['dashboard', 'admin', 'paginatedFirmApplications', status],
		[status],
	);
	const queryFn = useMemo<
		KeysetPaginatedQueryProviderProps<IPaginatedFirmApplicationsContext>['queryFn']
	>(
		() => (cursor, perPage) => () =>
			throwError(
				getPaginatedApplications({
					status,
					cursor,
					perPage,
				}),
			),
		[status],
	);

	return (
		<KeysetPaginatedQueryProvider
			defaultCursor={defaultCursor}
			defaultPerPage={defaultPerPage}
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			children={children}
			status={status}
			setStatus={setStatus}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedFirmApplicationsContextData,
	Context as PaginatedFirmApplicationsContext,
};
