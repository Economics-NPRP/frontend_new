import { PropsWithChildren } from 'react';

import { SingleAuctionProvider } from '@/contexts';
import { withProviders } from '@/helpers';

export default function AuctionLayout({ children }: PropsWithChildren) {
	return withProviders(<>{children}</>, { provider: SingleAuctionProvider });
}
