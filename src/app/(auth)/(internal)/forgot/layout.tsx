import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(internal)/(components)/(header)';

export interface ForgotPasswordProps {
	form: ReactNode;
}
export default function ForgotPassword({ form }: ForgotPasswordProps) {
	return (
		<>
			<Header
				heading="Forgot Your Password?"
				subheading="No worries! Just enter your email address and we'll send you a link to reset it (valid for 24 hours)"
				returnPage={{
					url: '/login',
					text: 'Back to Login',
				}}
			/>
			{form}
		</>
	);
}
