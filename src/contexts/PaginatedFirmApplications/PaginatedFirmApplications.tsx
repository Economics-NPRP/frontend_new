'use client';

import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { createContext, useMemo } from 'react';

import { KeysetPaginatedQueryProvider, KeysetPaginatedQueryProviderProps } from '@/contexts';
import { throwError } from '@/helpers';
import { useConditionalQueryState } from '@/hooks';
import { getPaginatedApplications } from '@/lib/users/firms/applications';
import {
	FirmApplicationStatusFilter,
	FirmApplicationStatusListFilter,
	IFirmApplication,
} from '@/schema/models';
import {
	KeysetPaginatedContextState,
	KeysetPaginatedProviderProps,
	getDefaultKeysetPaginatedContextState,
} from '@/types';

export interface IPaginatedFirmApplicationsContext
	extends KeysetPaginatedContextState<IFirmApplication> {
	status: FirmApplicationStatusFilter;
	setStatus: (status: FirmApplicationStatusFilter) => void;
}
const DefaultData = {
	...getDefaultKeysetPaginatedContextState<IFirmApplication>(),
	status: 'pending' as FirmApplicationStatusFilter,
	setStatus: () => {},
};
const Context = createContext<IPaginatedFirmApplicationsContext>(DefaultData);

export const PaginatedFirmApplicationsProvider = ({
	syncWithSearchParams,
	...props
}: KeysetPaginatedProviderProps) => {
	const [, setCursor] = useQueryState(
		'cursor',
		parseAsString.withDefault((props.defaultCursor || DefaultData.cursor) as string),
	);
	const [status, setStatus] = useConditionalQueryState({
		key: 'status',
		defaultValue: DefaultData.status,
		parser: parseAsStringLiteral(FirmApplicationStatusListFilter),
		syncWithSearchParams,
		onValueChange: () => setCursor(props.defaultCursor || DefaultData.cursor),
	});

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
				'getPaginatedFirmApplications',
			),
		[status],
	);

	return (
		<KeysetPaginatedQueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={queryKey}
			queryFn={queryFn}
			id="paginatedFirmApplications"
			syncWithSearchParams={syncWithSearchParams}
			status={status}
			setStatus={setStatus}
			{...props}
		/>
	);
};

export {
	DefaultData as DefaultPaginatedFirmApplicationsContextData,
	Context as PaginatedFirmApplicationsContext,
};
