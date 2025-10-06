'use server';

import { camelCase } from 'change-case/keys';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import 'server-only';

import { internalUrl } from '@/helpers';
import { IOnboardingData, DefaultOnboardingData } from '@/schema/models';
import { ServerData } from '@/types';

const getDefaultData: (...errors: Array<string>) => ServerData<IOnboardingData> = (
  ...errors
) => ({
  ok: false,
  errors: errors,
  ...DefaultOnboardingData,
});

type IFunctionSignature = (invitationToken: string) => Promise<ServerData<IOnboardingData>>;

export const getRegistrationInfo: IFunctionSignature = cache(async (invitationToken) => {
  const t = await getTranslations();
  if (!invitationToken) return getDefaultData(t('lib.auth.register.noToken'));

  const querySettings: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
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
  console.log("REached here")

  const response = await fetch(await internalUrl(`/api/proxy/v1/users/onboard/${invitationToken}`), querySettings);
  const rawData = camelCase(await response.json(), 5) as ServerData<IOnboardingData>;

  //	If theres an issue, return the default data with errors
  if (!rawData) return getDefaultData(t('lib.noData'));
  if (rawData.detail) return getDefaultData(rawData.detail ?? '');
  if (rawData.errors) return getDefaultData(...rawData.errors);

  //	TODO: Validate the data using schema
  return {
    ...rawData,
    ok: true,
  } as ServerData<IOnboardingData>;
});

//	@ts-expect-error - Preload doesn't return anything but signature requires a return
export const preloadRegistrationInfo: IFunctionSignature = async (options) => {
  void getRegistrationInfo(options);
};
