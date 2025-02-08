'use client';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import { ActionIcon, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChartLine } from '@tabler/icons-react';

export default function Prompt() {
	const [opened, { open, close }] = useDisclosure(false);
	return (
		<>
			<Group>
				<Stack>
					<Text>Minimum Winning Bid</Text>
					<Group>
						<CurrencyBadge />
						<Text>1,105.99</Text>
					</Group>
					<ActionIcon>
						<IconChartLine />
					</ActionIcon>
				</Stack>
				<Stack>
					<Text>Buy Now Price</Text>
					<Group>
						<CurrencyBadge />
						<Text>1,400.00</Text>
					</Group>
				</Stack>
				<Stack>
					<Text>Ending In</Text>
					<LargeCountdown targetDate={'2028-02-07T11:44:31.000Z'} />
					<Text>2028-02-07T11:44:31.000Z</Text>
				</Stack>
			</Group>
			<Group>
				<Button>Buy Now</Button>
				<Button onClick={open}>Place a Bid</Button>
			</Group>
			<Modal opened={opened} onClose={close} title={'Place a Bid'}>
				<Text>Enter the amount you want to bid for this auction</Text>
				<Button>Place Bid</Button>
			</Modal>
		</>
	);
}
