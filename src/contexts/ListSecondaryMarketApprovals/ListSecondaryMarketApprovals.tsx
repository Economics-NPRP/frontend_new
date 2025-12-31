'use client';

import { createContext } from 'react';

import { ArrayQueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getSecondaryMarketApprovals } from '@/lib/sma';
import { IAuctionApplication } from '@/schema/models';
import { ArrayContextState, CoreProviderProps, getDefaultArrayContextState } from '@/types';

export interface IListSecondaryMarketApprovalsContext extends ArrayContextState<IAuctionApplication> { }
const DefaultData = getDefaultArrayContextState<IAuctionApplication>();
const Context = createContext<IListSecondaryMarketApprovalsContext>(DefaultData);

export interface ListSecondaryMarketApprovalsProviderProps extends CoreProviderProps {
  status?: string;
  limit?: number;
}

export const ListSecondaryMarketApprovalsProvider = ({ id = 'listSecondaryMarketApprovals', status, limit, ...props }: ListSecondaryMarketApprovalsProviderProps) => {
  return (
    <ArrayQueryProvider
      context={Context}
      defaultData={DefaultData}
      queryKey={['listSecondaryMarketApprovals', status, limit]}
      queryFn={() => () => throwError(getSecondaryMarketApprovals(status, limit), 'getSecondaryMarketApprovals')}
      id={id}
      {...props}
    />
  );
};

export { DefaultData as DefaultListSecondaryMarketApprovalsContextData, Context as ListSecondaryMarketApprovalsContext };
