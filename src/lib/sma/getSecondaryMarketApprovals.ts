'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { IAuctionApplication } from '@/schema/models';
import { ArrayServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ArrayServerData<IAuctionApplication> = (...errors) => ({
  ok: false,
  errors: errors,
  results: [],
  resultCount: 0,
});

type IFunctionSignature = (status?: string, limit?: number) => Promise<ArrayServerData<IAuctionApplication>>;
export const getSecondaryMarketApprovals: IFunctionSignature = cache(async (status, limit) => {
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
  if (status) params.append('status', status);
  if (limit) params.append('limit', String(limit));

  const response = await fetch(
    await internalUrl(`/api/proxy/v1/auctions/secondary/approvals${params.toString() ? `?${params.toString()}` : ''}`),
    querySettings,
  );
  const rawData = camelCase(await response.json(), 5);
  //	If theres an issue, return the default data with errors
  if (!rawData) return getDefaultData(t('lib.noData'));
  if (!response.ok) return getDefaultData(t('lib.noData'));

  const results = Array.isArray(rawData) ? rawData as IAuctionApplication[] : transformToArray(rawData as Record<string, unknown>);

  return { results, ok: true, resultCount: results.length } as ArrayServerData<IAuctionApplication>;
});

function transformToArray(obj: Record<string, unknown>): IAuctionApplication[] {
  return Object.values(obj).filter((value) => typeof value !== 'boolean') as IAuctionApplication[];
}