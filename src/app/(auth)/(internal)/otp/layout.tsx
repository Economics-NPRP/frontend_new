import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(internal)/_components/Header';

export const metadata: Metadata = {
	title: 'OTP Verification',
};

export interface OTPProps {
	form: ReactNode;
}
export default function OTP({ form }: OTPProps) {
	const t = useTranslations();

	return (
		<>
			<Header
				heading={t('auth.otp.heading')}
				subheading={t('auth.otp.subheading')}
				returnPage={{
					url: '/login',
					text: t('constants.return.login.label'),
				}}
			/>
			{form}
		</>
	);
}
