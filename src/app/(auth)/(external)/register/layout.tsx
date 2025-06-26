import { withProviders } from 'helpers/withProviders';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { PageProvider } from '@/pages/(auth)/(external)/register/_components/Providers';

export const metadata: Metadata = {
	title: 'Register',
};

export interface RegisterProps {
	form: ReactNode;
	stepper: ReactNode;
}
export default function Register({ form, stepper }: RegisterProps) {
	return withProviders(
		<>
			{stepper}
			{form}
		</>,
		{ provider: PageProvider },
	);
}
