import { Metadata } from 'next';
import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(internal)/_components/Header';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Divider, Group } from '@mantine/core';

export const metadata: Metadata = {
	title: 'Register',
};

export interface RegisterProps {
	contact: ReactNode;
	map: ReactNode;
	code: ReactNode;
}
export default function Register({ contact, map, code }: RegisterProps) {
	return (
		<>
			{/* Don't remove, used to make panel wider */}
			<span className={`hidden ${classes.register}`} />

			<Header
				heading="Creating an Account"
				subheading="To create an account on the platform, you must first be invited by an admin. Use the form below to get in touch with us and request an invitation."
				returnPage={{
					url: '/login',
					text: 'Back to Login',
				}}
			/>
			<Group className={classes.row}>
				{contact}
				{map}
			</Group>
			<Divider label="OR" />
			{code}
		</>
	);
}
