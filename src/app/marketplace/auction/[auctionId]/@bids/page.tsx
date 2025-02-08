import { Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Title } from '@mantine/core';

export default function Bids() {
	return (
		<>
			<Title order={2}>Current Winning Bids</Title>
			<Table highlightOnHover>
				<TableThead>
					<TableTr>
						<TableTh>Company</TableTh>
						<TableTh>Bid</TableTh>
						<TableTh>Permits</TableTh>
						<TableTh>Timestamp</TableTh>
						<TableTh></TableTh>
					</TableTr>
				</TableThead>
				<TableTbody>
					<TableTr>
						<TableTd>Company A</TableTd>
						<TableTd>1000</TableTd>
						<TableTd>1000</TableTd>
						<TableTd>2021-10-10 12:00:00</TableTd>
					</TableTr>
				</TableTbody>
			</Table>
		</>
	);
}
