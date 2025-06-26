import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(internal)/_components/Header';

export const metadata: Metadata = {
	title: 'Login',
};

export interface LoginProps {
	form: ReactNode;
}
export default function Login({ form }: LoginProps) {
	const t = useTranslations();

	return (
		<>
			<Header heading={t('auth.login.heading')} subheading={t('auth.login.subheading')} />
			{form}
		</>
	);
}
