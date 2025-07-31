import { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
	title: {
		default: 'ETS Firm',
		template: '%s | ETS Firm',
	},
};

export default function FirmDashboardLayout({ children }: PropsWithChildren) {
	return children;
}
