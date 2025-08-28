import { Metadata } from 'next';
import { ReactNode } from 'react';

import { SingleFirmProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { getSingleFirm } from '@/lib/users/firms';
import { InvitationModalProvider } from '@/pages/dashboard/a/firms/_components/InvitationModal';
import { Container, Stack } from '@mantine/core';

import classes from './styles.module.css';

type SegmentParams<T extends object = any> = T extends Record<string, any>
	? { [K in keyof T]: T[K] extends string ? string | string[] | undefined : never }
	: T
type LayoutProps = {
	children?: React.ReactNode
	banner: React.ReactNode
	details: React.ReactNode
	environment: React.ReactNode
	hero: React.ReactNode
	trading: React.ReactNode
	users: React.ReactNode
	params?: Promise<SegmentParams>
}
export const generateMetadata = async ({ params }: LayoutProps): Promise<Metadata> => {
	const { firmId } = await params;
	const firm = await getSingleFirm(firmId);
	if (!firm) {
		return {
			title: {
				default: 'Firm Not Found',
				template: '%s - Firm Not Found',
			},
		};
	}
	return {
		title: {
			default: firm.name,
			template: `%s - ${firm.name}`,
		},
	};
};

export interface FirmDetailsProps {
	banner: ReactNode;
	details: ReactNode;
	environment: ReactNode;
	hero: ReactNode;
	trading: ReactNode;
	users: ReactNode;
}
export default function FirmDetails({
	banner,
	details,
	environment,
	hero,
	trading,
	users,
}: FirmDetailsProps) {
	return withProviders(
		<>
			<Container className={classes.bg}>
				<Container className={classes.pattern} />
				<Container className={classes.gradient} />
			</Container>
			<Stack className={classes.root}>
				{hero}
				{banner}
				{details}
				<Container className={classes.content}>
					{users}
					{environment}
					{trading}
				</Container>
			</Stack>
		</>,
		{ provider: SingleFirmProvider },
		{ provider: InvitationModalProvider },
	);
}
