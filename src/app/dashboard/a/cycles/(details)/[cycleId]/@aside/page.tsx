'use client';

import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { CommentsContent } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/@aside/Comments';
import { MembersContent } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/@aside/Members';
import { UpdatesContent } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/@aside/Updates';
import { CycleDetailsPageContext } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/_components/Providers';
import { Drawer, Tabs } from '@mantine/core';
import { IconBell, IconMessage, IconUsers } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Aside() {
	const t = useTranslations();
	const { tab, setTab, isDrawerOpen, closeDrawer } = useContext(CycleDetailsPageContext);

	return (
		<Drawer
			opened={isDrawerOpen}
			onClose={closeDrawer}
			classNames={{
				content: classes.root,
				header: classes.header,
				title: classes.title,
				body: classes.body,
				close: classes.close,
			}}
			title={t('dashboard.admin.cycles.details.aside.title')}
			position="right"
		>
			<Tabs
				classNames={{ root: classes.tabs, panel: classes.panel, tab: classes.tab }}
				value={tab}
				onChange={(value) => setTab(value as 'members' | 'comments' | 'updates')}
			>
				<Tabs.List grow>
					<Tabs.Tab value={'members'} leftSection={<IconUsers size={14} />}>
						{t('dashboard.admin.cycles.details.aside.members.tab')}
					</Tabs.Tab>
					<Tabs.Tab value={'comments'} leftSection={<IconMessage size={14} />}>
						{t('dashboard.admin.cycles.details.aside.comments.tab')}
					</Tabs.Tab>
					<Tabs.Tab value={'updates'} leftSection={<IconBell size={14} />}>
						{t('dashboard.admin.cycles.details.aside.updates.tab')}
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value={'members'}>
					<MembersContent />
				</Tabs.Panel>
				<Tabs.Panel value={'comments'}>
					<CommentsContent />
				</Tabs.Panel>
				<Tabs.Panel value={'updates'}>
					<UpdatesContent />
				</Tabs.Panel>
			</Tabs>
		</Drawer>
	);
}
