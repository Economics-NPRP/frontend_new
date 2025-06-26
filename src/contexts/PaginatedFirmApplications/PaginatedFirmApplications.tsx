'use client';

import { createContext, useState } from 'react';

import { KeysetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getPaginatedApplications } from '@/lib/users/firms/applications';
import { FirmApplicationStatus, IFirmApplication } from '@/schema/models';
import {
	KeysetPaginatedContextState,
	KeysetPaginatedProviderProps,
	getDefaultKeysetPaginatedContextState,
} from '@/types';

export interface IPaginatedFirmApplicationsContext
	extends KeysetPaginatedContextState<IFirmApplication> {
	status?: FirmApplicationStatus;
	setStatus?: (status: FirmApplicationStatus) => void;
}
const DefaultData = getDefaultKeysetPaginatedContextState<IFirmApplication>();
const Context = createContext<IPaginatedFirmApplicationsContext>(DefaultData);

export const PaginatedFirmApplicationsProvider = ({
	defaultCursor,
	defaultPerPage,
	children,
}: KeysetPaginatedProviderProps) => {
	const [status, setStatus] = useState<FirmApplicationStatus | undefined>(undefined);

	return (
		<KeysetPaginatedQueryProvider
			defaultCursor={defaultCursor}
			defaultPerPage={defaultPerPage}
			context={Context}
			defaultData={DefaultData}
			queryKey={['dashboard', 'admin', 'paginatedFirmApplications']}
			queryFn={(cursor, perPage) => () =>
				throwError(
					getPaginatedApplications({
						status,
						cursor,
						perPage,
					}),
				)
			}
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
