import { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
	title: {
		default: 'ETS Admin',
		template: '%s | ETS Admin',
	},
};

export default function AdminDashboardLayout({ children }: PropsWithChildren) {
	return children;
}
