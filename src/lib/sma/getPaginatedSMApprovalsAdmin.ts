'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { AuctionApplicationStatusFilter } from '@/schema/models';
import { IOffsetPagination, OffsetPaginatedData } from '@/types';
import { PositiveNumber } from '@/schema/utils';
import { ISMApprovalAdminData } from '@/schema/models/SMApprovalsAdminData';

export interface IGetPaginatedSMApprovalsAdminOptions extends IOffsetPagination {
  status?: AuctionApplicationStatusFilter,
  emissionId?: PositiveNumber,
  toFirmId?: string,
  fromFirmId?: string,
  createdFrom?: string,
  createdTo?: string,
}

const getDefaultData: (...errors: Array<string>) => OffsetPaginatedData<ISMApprovalAdminData> = (
  ...errors
) => ({
  ok: false,
  errors: errors,
  results: [] as Array<ISMApprovalAdminData>,
  page: 1,
  pageCount: 1,
  totalCount: 0,
  perPage: 12,
  resultCount: 0,
});

type IFunctionSignature = (
  options: IGetPaginatedSMApprovalsAdminOptions,
) => Promise<OffsetPaginatedData<ISMApprovalAdminData>>;
export const getPaginatedSMApprovalsAdmin: IFunctionSignature = cache(
  async ({
    page,
    perPage,
    status,
    emissionId,
    toFirmId,
    fromFirmId,
    createdFrom,
    createdTo,
  }) => {
    const t = await getTranslations();

    const cookieStore = await cookies();
    const access = cookieStore.get('ets_access_token')?.value;
    const refresh = cookieStore.get('ets_refresh_token')?.value;
    const cookieHeaders =
      access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
    if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
    const querySettings: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeaders,
        ...(await (async () => {
          try {
            const h = await headers();
            const xff = h.get('x-forwarded-for') || h.get('x-real-ip');
            return xff ? { 'X-Forwarded-For': xff } : {};
          } catch {
            return {} as Record<string, string>;
          }
        })()),
      },
    };

    const params = new URLSearchParams();
    if (page) params.append('offset', page.toString());
    if (perPage) params.append('limit', perPage.toString());
    if (status) params.append('status', status);
    if (emissionId) params.append('emission_id', emissionId.toString());
    if (toFirmId) params.append('to_firm_id', toFirmId);
    if (fromFirmId) params.append('from_firm_id', fromFirmId);
    if (createdFrom) params.append('created_from', createdFrom);
    if (createdTo) params.append('created_to', createdTo);

    const response = await fetch(
      await internalUrl(
        `/api/proxy/v1/permits/transfer/requests${params.toString() ? `?${params.toString()}` : ''}`,
      ),
      querySettings,
    );
    const rawData = camelCase(await response.json(), 5) as ISMApprovalAdminData[];

    if (!rawData) return getDefaultData(t('lib.noData'));
    if (response.status > 299 || response.status < 200) {
      return getDefaultData(t('lib.unknownError'));
    }

    //	Parse results using schema and collect issues
    const errors: Array<string> = [];
    console.log("Raw Data:", rawData);
    const results = rawData.reduce<Array<ISMApprovalAdminData>>((acc, result) => {
      acc.push(result as ISMApprovalAdminData);
      return acc;
    }, []);

    return {
      ok: errors.length === 0,
      results,
      errors,
      page: page,
      perPage: perPage,
      pageCount: Math.ceil(results.length / (perPage || 1)),
      totalCount: results.length,
    } as OffsetPaginatedData<ISMApprovalAdminData>;
  },
);

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadPaginatedSMApprovalsAdmin: IFunctionSignature = async (options) => {
  void getPaginatedSMApprovalsAdmin(options);
};
