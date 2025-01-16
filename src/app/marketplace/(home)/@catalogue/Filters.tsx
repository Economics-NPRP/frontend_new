import {
	Accordion,
	AccordionControl,
	AccordionItem,
	AccordionPanel,
	ActionIcon,
	Anchor,
	Button,
	Checkbox,
	Container,
	Divider,
	Group,
	RangeSlider,
	Stack,
	Text,
	TextInput,
	Title,
	Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconArrowBackUp, IconCheck, IconPlus, IconTrash } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Filters = () => {
	return (
		<Stack className={classes.filters}>
			<Group className={classes.header}>
				<Container className={classes.bg}>
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
				</Container>
				<Title className={classes.heading} order={3}>
					Filters List
				</Title>
				<Text className={classes.subheading}>
					Use the filters below to find the auctions you are looking for
				</Text>
			</Group>
			<Divider />
			<Accordion
				classNames={{
					root: classes.accordion,
					chevron: classes.chevron,
					content: classes.content,
				}}
				defaultValue={['type', 'status', 'sector']}
				chevron={<IconPlus size={16} />}
				multiple
			>
				<AccordionItem value={'type'}>
					<AccordionControl classNames={{ label: classes.title }}>
						Auction Type
					</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Filter for open or sealed auctions.{' '}
							<Anchor>What's the difference?</Anchor>
						</Text>
						<Container className={classes.values}>
							<Checkbox className={classes.checkbox} label="Open" value="open" />
							<Checkbox className={classes.checkbox} label="Sealed" value="sealed" />
						</Container>
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem value={'status'}>
					<AccordionControl classNames={{ label: classes.title }}>
						Auction Status
						<Text className={classes.subtitle}>2 filters applied</Text>
					</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Find auctions that are ongoing, ended, or upcoming
						</Text>
						<Container className={classes.values}>
							<Checkbox
								className={classes.checkbox}
								label="Ongoing"
								value="ongoing"
								defaultChecked
							/>
							<Checkbox className={classes.checkbox} label="Ended" value="ended" />
							<Checkbox
								className={classes.checkbox}
								label="Ending Soon"
								value="ending"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Upcoming"
								value="upcoming"
								defaultChecked
							/>
							<Checkbox
								className={classes.checkbox}
								label="Starting Soon"
								value="starting"
							/>
						</Container>
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem value={'sector'}>
					<AccordionControl classNames={{ label: classes.title }}>
						Sector
					</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Filter auctions by the sector they belong to
						</Text>
						<Container className={classes.values}>
							<Checkbox className={classes.checkbox} label="Energy" value="energy" />
							<Checkbox
								className={classes.checkbox}
								label="Industry"
								value="industry"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Transport"
								value="transport"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Buildings"
								value="buildings"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Agriculture"
								value="agriculture"
							/>
							<Checkbox className={classes.checkbox} label="Waste" value="waste" />
						</Container>
					</AccordionPanel>
				</AccordionItem>
				{/* Add infinite scrolling for owner names/ids */}
				<AccordionItem value={'owner'}>
					<AccordionControl classNames={{ label: classes.title }}>Owner</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Search auctions from specific owners
						</Text>
						<TextInput placeholder="Search for a firm by name or ID" />
						<Container className={classes.values}>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company A (FM-a4sh4)"
								value="FM-a4sh4"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company B (FM-3r4h3)"
								value="FM-3r4h3"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company C (FM-gsdf7)"
								value="FM-gsdf7"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company D (FM-823yg)"
								value="FM-823yg"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company E (FM-13hjk)"
								value="FM-13hjk"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company F (FM-9sdf8)"
								value="FM-9sdf8"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company G (FM-1sdf2)"
								value="FM-1sdf2"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company H (FM-4sdf5)"
								value="FM-4sdf5"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company I (FM-7sdf8)"
								value="FM-7sdf8"
							/>
							<Checkbox
								className={classes.checkbox}
								label="Fake Company J (FM-2sdf3)"
								value="FM-2sdf3"
							/>
						</Container>
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem value={'date'}>
					<AccordionControl classNames={{ label: classes.title }}>Date</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Filter for auctions by their start and end dates
						</Text>
						<Container className={classes.values}>
							<DatePickerInput
								type="range"
								placeholder="Start Date - End Date"
								allowSingleDateInRange
								clearable
							/>
						</Container>
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem value={'permits'}>
					<AccordionControl classNames={{ label: classes.title }}>
						Permits Offered
					</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Filter for auctions by the number of permits they offer
						</Text>
						<Container className={classes.values}>
							<RangeSlider
								className={classes.range}
								min={1}
								thumbSize={14}
								size={'sm'}
								labelAlwaysOn
							/>
						</Container>
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem value={'minBid'}>
					<AccordionControl classNames={{ label: classes.title }}>
						Minimum Winning Bid
					</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Filter for auctions by the minimum bid required to win
						</Text>
						<Container className={classes.values}>
							<RangeSlider
								className={classes.range}
								min={1}
								thumbSize={14}
								size={'sm'}
								labelAlwaysOn
							/>
						</Container>
					</AccordionPanel>
				</AccordionItem>
				<AccordionItem value={'price'}>
					<AccordionControl classNames={{ label: classes.title }}>
						Buy Now Price
					</AccordionControl>
					<AccordionPanel>
						<Text className={classes.description}>
							Filter for auctions by the buy now price
						</Text>
						<Container className={classes.values}>
							<RangeSlider
								className={classes.range}
								min={1}
								thumbSize={14}
								size={'sm'}
								labelAlwaysOn
							/>
						</Container>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Group className={classes.footer}>
				<Text className={classes.value}>2 filters applied</Text>
				<Group className={classes.actions}>
					<Tooltip label="Clear all filters">
						<ActionIcon className={`${classes.action} ${classes.square}`}>
							<IconTrash size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Reset changes to filters">
						<ActionIcon className={`${classes.action} ${classes.square}`}>
							<IconArrowBackUp size={16} />
						</ActionIcon>
					</Tooltip>
					<Tooltip label="Apply filter changes">
						<Button className={classes.action} rightSection={<IconCheck size={16} />}>
							Apply
						</Button>
					</Tooltip>
				</Group>
			</Group>
		</Stack>
	);
};
