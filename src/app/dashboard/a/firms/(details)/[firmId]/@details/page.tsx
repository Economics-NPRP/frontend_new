'use client';

import { useTranslations } from 'next-intl';
import { useContext, useMemo } from 'react';

import { FirmStatusBadge, SectorBadge } from '@/components/Badge';
import { Id } from '@/components/Id';
import { WithSkeleton } from '@/components/WithSkeleton';
import { SectorVariants } from '@/constants/SectorData';
import { SingleFirmContext } from '@/contexts';
// import { InvitationModalContext } from '@/pages/dashboard/a/firms/_components/InvitationModal';
import { SectorType } from '@/schema/models';
import {
	ActionIcon,
	Anchor,
	Button,
	Container,
	CopyButton,
	Group,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import {
	IconBan,
	IconCertificate,
	IconCheck,
	IconCopy,
	IconFileSearch,
	IconFlag,
	IconMail,
	IconPhone,
	IconWorld,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Details() {
	const t = useTranslations();
	const firm = useContext(SingleFirmContext);
	// const invitationModal = useContext(InvitationModalContext);

	const badges = useMemo(
		() =>
			firm.isLoading
				? [
						<FirmStatusBadge key={1} status="pending" loading />,
						<FirmStatusBadge key={2} status="pending" loading />,
						<FirmStatusBadge key={3} status="pending" loading />,
					]
				: [
						<FirmStatusBadge
							key={'status'}
							status={firm.data.emailVerified ? 'approved' : 'pending'}
						/>,
						...firm.data.sectors
							.filter((sector) => SectorVariants[sector.toLowerCase() as SectorType])
							.map((sector) => <SectorBadge key={sector} sector={sector} />),
					],
		[firm.data.sectors],
	);

	return (
		<Stack className={classes.root}>
			<Stack className={classes.label}>
				<WithSkeleton loading={firm.isLoading} width={280} height={36}>
					<Title order={1} className={classes.title}>
						{firm.data.name}
					</Title>
				</WithSkeleton>
				<WithSkeleton loading={firm.isLoading} width={160} height={24}>
					<Id variant="company" value={firm.data.id} className={classes.id} />
				</WithSkeleton>
			</Stack>
			<Group className={classes.badges}>{badges}</Group>
			<Group className={classes.contact}>
				<Stack className={classes.cell}>
					<Container className={classes.icon}>
						<IconMail size={16} />
					</Container>
					<Text className={classes.key}>
						{t('dashboard.admin.firms.details.details.email.label')}
					</Text>
					<WithSkeleton width={140} height={20} loading={firm.isLoading} data-dark>
						<Anchor href={`mailto:${firm.data.email}`} className={classes.value}>
							{firm.data.email}
						</Anchor>
					</WithSkeleton>
				</Stack>
				<Stack className={classes.cell}>
					<Container className={classes.icon}>
						<IconPhone size={16} />
					</Container>
					<Text className={classes.key}>
						{t('dashboard.admin.firms.details.details.phone.label')}
					</Text>
					<WithSkeleton width={80} height={20} loading={firm.isLoading} data-dark>
						<Anchor href={`tel:${firm.data.phone}`} className={classes.value}>
							{firm.data.phone}
						</Anchor>
					</WithSkeleton>
				</Stack>
				<Stack className={classes.cell}>
					<Container className={classes.icon}>
						<IconCertificate size={16} />
					</Container>
					<Text className={classes.key}>
						{t('dashboard.admin.firms.details.details.crn.label')}
					</Text>
					<Group className={classes.row}>
						<WithSkeleton width={80} height={20} loading={firm.isLoading} data-dark>
							<Text className={classes.value}>1234567890</Text>
						</WithSkeleton>
						<CopyButton value={'1234567890'} timeout={2000}>
							{({ copied, copy }) => (
								<Tooltip
									label={
										copied
											? t('constants.actions.copied.label')
											: t('constants.actions.copy.label')
									}
								>
									<ActionIcon
										className={classes.copy}
										color={copied ? 'teal' : 'gray'}
										variant="light"
										onClick={copy}
									>
										{copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
									</ActionIcon>
								</Tooltip>
							)}
						</CopyButton>
					</Group>
				</Stack>
				<Stack className={classes.cell}>
					<Container className={classes.icon}>
						<IconWorld size={16} />
					</Container>
					<Text className={classes.key}>
						{t('dashboard.admin.firms.details.details.website.label')}
					</Text>
					<WithSkeleton width={80} height={20} loading={firm.isLoading} data-dark>
						<Anchor className={classes.value}>{firm.data.name}.com</Anchor>
					</WithSkeleton>
				</Stack>
			</Group>
			<Group className={classes.actions}>
				<Button className={classes.button} color="red" leftSection={<IconFlag size={16} />}>
					{t('dashboard.admin.firms.details.details.actions.report.label')}
				</Button>
				<Button className={classes.button} color="red" leftSection={<IconBan size={16} />}>
					{t('dashboard.admin.firms.details.details.actions.suspend.label')}
				</Button>
				<Button
					className={`${classes.primary} ${classes.button}`}
					leftSection={<IconFileSearch size={16} />}
				>
					{t('dashboard.admin.firms.details.details.actions.audit.label')}
				</Button>
				{/* TODO: Fix firm.data type and missing information to get invitation modal */}
				{/* <Button
					className={`${classes.primary} ${classes.button}`}
					leftSection={<IconMailShare size={16} />}
					onClick={() => invitationModal.open(firm.data)}
				>
					{t('dashboard.admin.firms.details.details.actions.invite.label')}
				</Button> */}
			</Group>
		</Stack>
	);
}
