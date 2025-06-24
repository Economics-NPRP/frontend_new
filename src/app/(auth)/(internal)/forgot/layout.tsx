import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(internal)/_components/Header';

export const metadata: Metadata = {
	title: 'Forgot Password',
};

export interface ForgotPasswordProps {
	form: ReactNode;
}
export default function ForgotPassword({ form }: ForgotPasswordProps) {
	const t = useTranslations();

	return (
		<>
			<Header
				heading={t('auth.forgot.heading')}
				subheading={t('auth.forgot.subheading')}
				returnPage={{
					url: '/login',
					text: t('constants.return.login.label'),
				}}
			/>
			{form}
		</>
	);
}
