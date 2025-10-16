'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { createContext, useMemo } from 'react';

import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getRegistrationInfo } from '@/lib/auth';
import { DefaultOnboardingData, IOnboardingData } from '@/schema/models';
import { CoreProviderProps, ServerContextState, getDefaultContextState } from '@/types';

export interface IOnBoardingContext extends ServerContextState<IOnboardingData> { }
const DefaultData = getDefaultContextState(DefaultOnboardingData);
const Context = createContext<IOnBoardingContext>(DefaultData);

export interface OnBoardingProviderProps extends CoreProviderProps {
  tokenSource?: 'route' | 'searchParams';
}
export const OnBoardingProvider = ({
  tokenSource = 'route',
  id = 'OnBoarding',
  ...props
}: OnBoardingProviderProps) => {
  const params = useParams();
  const searchParams = useSearchParams();

  const invitationToken = useMemo(() => {
    if (tokenSource === 'route') return params.token;
    if (tokenSource === 'searchParams') return searchParams.get('token');
    return null;
  }, [tokenSource, params, searchParams]);

  return (
    <QueryProvider
      context={Context}
      defaultData={DefaultData}
      queryKey={['dashboard', 'admin', invitationToken as string, 'OnBoarding']}
      queryFn={() => () =>
        throwError(getRegistrationInfo(invitationToken as string), `getOnBoarding:${invitationToken}`)
      }
      id={id}
      disabled={!invitationToken}
      {...props}
    />
  );
};

export { DefaultData as DefaultOnBoardingContextData, Context as OnBoardingContext };
