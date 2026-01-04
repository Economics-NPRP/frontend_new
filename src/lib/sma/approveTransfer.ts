'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<{}> = (...errors) => ({
  ok: false,
  errors: errors,
});

type IFunctionSignature = (requestId: string, decision: "approve"|"reject", notes: string) => Promise<ServerData<{}>>;

export const approveTransfer: IFunctionSignature = cache(async (requestId, decision, notes) => {
  const t = await getTranslations();

  const cookieStore = await cookies();
  const access = cookieStore.get('ets_access_token')?.value;
  const refresh = cookieStore.get('ets_refresh_token')?.value;
  const cookieHeaders =
    access && refresh ? `ets_access_token=${access}; ets_refresh_token=${refresh}` : '';
  if (!cookieHeaders) return getDefaultData(t('lib.notLoggedIn'));
  const querySettings: RequestInit = {
    method: 'POST',
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
    body: JSON.stringify({
      request_id: requestId,
      approve: decision === "approve",
      decision_notes: notes
    }),
  };

  const response = await fetch(await internalUrl(`/api/proxy/v1/permits/transfer/requests/decision`), querySettings);
  const rawData = camelCase(await response.json(), 5) as ServerData<unknown>;

  //	If theres an issue, return the default data with errors
  if (!rawData) return getDefaultData(t('lib.noData'));
  if (rawData.detail) return getDefaultData(rawData.detail ?? '');
  if (rawData.errors) return getDefaultData(...rawData.errors);

  return {
    ...rawData,
    ok: true,
  } as ServerData<{}>;
});
