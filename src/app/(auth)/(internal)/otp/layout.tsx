import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(internal)/(components)/(header)';

export interface OTPProps {
	form: ReactNode;
}
export default function OTP({ form }: OTPProps) {
	return (
		<>
			<Header
				heading="OTP Verification"
				subheading="Verify your identity by entering the OTP sent to your email address."
				returnPage={{
					url: '/login',
					text: 'Back to Login',
				}}
			/>
			{form}
		</>
	);
}
