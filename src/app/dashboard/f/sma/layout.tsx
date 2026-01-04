import { Metadata } from 'next';
import { ReactNode } from 'react';

import { withProviders } from '@/helpers';
import '@/styles/globals.css';
import { Stack } from '@mantine/core';

export const metadata: Metadata = {
  title: {
    default: 'Secondary Market Auctions',
    template: '%s | SMA',
  },
};
export interface SecondaryMarketAuctionsProps {
  subbanners: ReactNode;
}
export default async function FirmDashboardSMALayout({
  subbanners,
}: SecondaryMarketAuctionsProps) {
  return withProviders(
    <Stack>
      {subbanners}
    </Stack>
  );
}
