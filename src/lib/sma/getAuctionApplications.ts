'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { DefaultMyAuctionResultsData, IMyAuctionResultsData, ServerData } from '@/types';
import { DefaultAuctionApplication, IAuctionApplication } from '@/schema/models/AuctionApplicationData';

export interface IGetAuctionApplications {
  status: string;
  limit: number;
}

const getDefaultData: (...errors: Array<string>) => ServerData<IAuctionApplication> = (
  ...errors
) => ({
  ...DefaultAuctionApplication,
  ok: false,
  errors: errors,
});

type IFunctionSignature = (status: string, limit: number) => Promise<ServerData<IAuctionApplication>>;

export const getAuctionApplications: IFunctionSignature = cache(async (status, limit) => {
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
  const rawData = camelCase(await response.json(), 5) as ServerData<IAuctionApplication>;

  //	If theres an issue, return the default data with errors
  if (!rawData) return getDefaultData(t('lib.noData'));
  if (rawData.detail) return getDefaultData(rawData.detail ?? '');
  if (rawData.errors) return getDefaultData(...rawData.errors);

  return {
    ...rawData,
    ok: true,
  } as ServerData<IAuctionApplication>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadAuctionApplications: IFunctionSignature = async (status, limit) => {
  void getAuctionApplications(status, limit);
};
