import { useCallback, useState } from 'react';

import {
	ActionIcon,
	Badge,
	Container,
	FloatingIndicator,
	Group,
	Select,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { IconDownload, IconLayoutGrid, IconListDetails } from '@tabler/icons-react';

import classes from './styles.module.css';

type ViewType = 'grid' | 'list';

export const Header = () => {
	const [view, setView] = useState<ViewType>('grid');
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});

	const setControlRef = useCallback(
		(index: ViewType) => (node: HTMLButtonElement) => {
			controlsRefs[index] = node;
			setControlsRefs(controlsRefs);
		},
		[],
	);

	return (
		<Stack className={classes.header}>
			<Container className={classes.bg}>
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
			</Container>
			<Group className={classes.row}>
				<Group className={classes.label}>
					<Title className={classes.heading} order={2}>
						Auction Catalogue
					</Title>
					<Text className={classes.slash}>-</Text>
					<Text className={classes.subheading}>
						Showing <b>1 - 12</b> of 100 auctions
					</Text>
				</Group>
				<Group className={classes.settings}>
					<Text className={classes.label}>Sort by:</Text>
					<Select
						className={classes.dropdown}
						w={128}
						defaultValue={'Permits'}
						data={['Permits', 'Popularity', 'Ending Soon', 'Newest']}
					/>
					<Text className={classes.label}>Per page:</Text>
					<Select
						className={classes.dropdown}
						w={64}
						defaultValue={'12'}
						data={['6', '12', '24']}
					/>
				</Group>
			</Group>
			<Group className={classes.row}>
				<Group className={classes.filters}>
					<Text className={classes.heading}>Filters:</Text>
					<Badge className={classes.badge}>No Filters Applied</Badge>
				</Group>
				<Group>
					<Group className={classes.viewActions} ref={setRootRef}>
						<Tooltip label="Switch to grid view">
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('grid')}
								onClick={() => setView('grid')}
								data-active={view === 'grid'}
							>
								<IconLayoutGrid size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Switch to list view">
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								ref={setControlRef('list')}
								onClick={() => setView('list')}
								data-active={view === 'list'}
							>
								<IconListDetails size={16} />
							</ActionIcon>
						</Tooltip>

						<FloatingIndicator
							className={classes.indicator}
							target={controlsRefs[view]}
							parent={rootRef}
						/>
					</Group>
					<Tooltip label="Download all auctions as CSV">
						<ActionIcon className={`${classes.action} ${classes.square}`}>
							<IconDownload size={16} />
						</ActionIcon>
					</Tooltip>
				</Group>
				{/* <Pagination
					classNames={{
						root: classes.pagination,
						dots: classes.dots,
						control: classes.action,
					}}
					total={10}
				/> */}
			</Group>
		</Stack>
	);
};
