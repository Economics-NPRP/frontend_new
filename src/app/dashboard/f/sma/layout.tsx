import { Metadata } from 'next';
import { ReactNode } from 'react';

import { withProviders } from '@/helpers';
import '@/styles/globals.css';
import { Stack, Divider } from '@mantine/core';
import { PaginatedAuctionsProvider } from 'contexts/PaginatedAuctions';

export const metadata: Metadata = {
  title: {
    default: 'Secondary Market Auctions',
    template: '%s | SMA',
  },
};
export interface SecondaryMarketAuctionsProps {
  subbanners: ReactNode;
  auctions: ReactNode;
}
export default async function FirmDashboardSMALayout({
  subbanners,
  auctions
}: SecondaryMarketAuctionsProps) {
  return withProviders(
    <Stack>
      {subbanners}
      <Divider my={16} />
      {auctions}
    </Stack>,
    {
      provider: PaginatedAuctionsProvider,
      props: {
        defaultFilters: {
          ownership: "private"
        },
        owned: true
      }
    }
  );
}
