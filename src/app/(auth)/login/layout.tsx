import { ReactNode } from 'react';

import Header from '@/pages/(auth)/(header)/page';

export interface LoginProps {
	form: ReactNode;
}
export default function Login({ form }: LoginProps) {
	return (
		<>
			<Header
				heading="Login to ETS"
				subheading="Welcome to the ETS platform, where you can trade carbon credits and manage
						emissions."
			/>
			{form}
		</>
	);
}
