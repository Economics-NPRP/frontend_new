'use client';

import { useParams } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useQueryState, parseAsInteger, parseAsStringLiteral, parseAsString } from 'nuqs';
import { useConditionalQueryStates } from '@/hooks';
import { MyUserProfileContext } from '@/contexts';
import { SMApprovalsFiltersData, DefaultSMApprovalsFiltersData } from '@/schema/models/SMApprovalsAdminFilter';
import { OffsetPaginatedQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { useAuctionAvailability } from '@/hooks';
import { getPaginatedSMApprovalsAdmin } from '@/lib/sma';
import {
  OffsetPaginatedContextState,
  OffsetPaginatedProviderProps,
  getDefaultOffsetPaginatedContextState,
} from '@/types';
import { ISMApprovalAdminData } from '@/schema/models/SMApprovalsAdminData';
import { PermitTransferStatusListFilter } from '@/schema/models/PermitTransferStatus';

export interface IPaginatedSMApprovalsContext extends OffsetPaginatedContextState<ISMApprovalAdminData> {
  filters: SMApprovalsFiltersData;
  setAllFilters: (filters: SMApprovalsFiltersData) => void;
  setSingleFilter: (key: keyof SMApprovalsFiltersData, value: any) => void;
  removeFilter: (key: keyof SMApprovalsFiltersData) => void;
  resetFilters: () => void;
}
const DefaultData: IPaginatedSMApprovalsContext = {
  ...getDefaultOffsetPaginatedContextState<ISMApprovalAdminData>(),
  filters: DefaultSMApprovalsFiltersData,
  setAllFilters: () => { },
  setSingleFilter: () => { },
  removeFilter: () => { },
  resetFilters: () => { },
};
const Context = createContext<IPaginatedSMApprovalsContext>(DefaultData);

export interface PaginatedSMApprovalsProviderProps extends OffsetPaginatedProviderProps {
  defaultFilters?: SMApprovalsFiltersData;
}
export const PaginatedSMApprovalsProvider = ({
  defaultFilters,
  syncWithSearchParams = false,
  id = 'paginatedSMApprovals',
  ...props
}: PaginatedSMApprovalsProviderProps) => {
  const myUser = useContext(MyUserProfileContext);
  const isAdmin = useMemo(() => myUser?.data?.type === 'admin', [myUser?.data?.type]);

  const [, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(props.defaultPage || DefaultData.page),
  );
  const [filters, setAllFilters] = useConditionalQueryStates<SMApprovalsFiltersData>({
    emissionId: parseAsInteger.withDefault(0),
    toFirmId: parseAsString,
    fromFirmId: parseAsString,
    createdFrom: parseAsString,
    createdTo: parseAsString,
    status: parseAsStringLiteral(PermitTransferStatusListFilter),
    syncWithSearchParams,
    defaultValue: defaultFilters || DefaultData.filters,

    //	Go back to the first page when filters change
    onValueChange: () => setPage(props.defaultPage || DefaultData.page),
  });

  const resetFilters = useCallback<IPaginatedSMApprovalsContext['resetFilters']>(
    () => setAllFilters(DefaultData.filters),
    [],
  );

  const removeFilter = useCallback<IPaginatedSMApprovalsContext['removeFilter']>(
    (key) => {
      setAllFilters({ ...filters, [key]: DefaultData.filters[key] });
    },
    [filters],
  );

  const setSingleFilter = useCallback<IPaginatedSMApprovalsContext['setSingleFilter']>(
    (key, value) => {
      setAllFilters({
        ...filters,
        [key]: value,
      });
    },
    [filters],
  );

  const queryKey = useMemo(
    () => ['smaApprovals', JSON.stringify(filters)],
    [filters],
  );
  const queryFn = useMemo(
    () => (page: number, perPage: number) => () =>
      throwError(
        getPaginatedSMApprovalsAdmin({
          page,
          perPage,
          emissionId: filters.emissionId || undefined,
          toFirmId: filters.toFirmId || undefined,
          fromFirmId: filters.fromFirmId || undefined,
          createdFrom: filters.createdFrom || undefined,
          createdTo: filters.createdTo || undefined,
          status: (filters.status !== "all" && filters.status) || undefined,
        }),
        `getPaginatedSMApprovalsAdmin`,
      ),
    [filters],
  );

  return (
    <OffsetPaginatedQueryProvider
      context={Context}
      defaultData={DefaultData}
      queryKey={queryKey}
      queryFn={queryFn}
      id={id}
      disabled={!isAdmin}
      filters={filters}
      setAllFilters={setAllFilters}
      setSingleFilter={setSingleFilter}
      removeFilter={removeFilter}
      resetFilters={resetFilters}
      {...props}
    />
  );
};

export {
  DefaultData as DefaultSMApprovalsContextData,
  Context as PaginatedSMApprovalsContext,
};
