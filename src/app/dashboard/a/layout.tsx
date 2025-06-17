import { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
	title: {
		default: 'ETS Admin Dashboard',
		template: '%s | ETS Admin Dashboard',
	},
};

export default function AdminDashboardLayout({ children }: PropsWithChildren) {
	return children;
}
