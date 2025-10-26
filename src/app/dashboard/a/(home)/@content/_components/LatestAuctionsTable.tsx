import { useMemo } from "react"
import { DataTable } from "mantine-datatable"
import { SectorVariants } from "@/constants/SectorData"
import { SectorType } from "@/schema/models"
import { SectorBadge } from "@/components/Badge"
import { HoverCard, Group, Badge } from "@mantine/core"
import { useTranslations } from "next-intl"
import { AuctionTypeBadge } from "@/components/Badge"
import { AuctionType } from "@/schema/models"
import { AuctionStatusBadge, AuctionStatusType } from "@/components/Badge"
import classes from './styles.module.css'
import { useRouter } from "next/navigation"

type LatestAuctionsTableProps = {
  className?: string;
  records?: {
    name: string;
    status: string;
    sectors: SectorType[];
    bidders: number;
    bids: number;
    type: string;
  }[];
}

const LatestAuctionsTable = ({ className, records }: LatestAuctionsTableProps) => {
  const t = useTranslations()
  const router = useRouter()
  const handleRoute = () => {
    router.push('/dashboard/a/cycles/auctions')
  }

  return (
    <DataTable
      className={classes.latestAuctions + ' ' + (className || '')}
      classNames={{
        header: classes.header
      }}
      onRowClick={handleRoute}
      height={96*4-16}
      records={records ? records : 
        Array.from({ length: 10 }).map((_, index) => ({
        name: `Auction ${index + 1} fghfd ghfdhjg fhjdfghjghj fghjfghj gfhjf ghj fghj`,
        status: index % 2 === 0 ? 'live' : 'ended',
        sectors: ['energy', 'industry', 'agriculture'],
        bidders: Math.floor(Math.random() * 100) + 1,
        bids: Math.floor(Math.random() * 200) + 1,
        type: index % 2 === 0 ? 'open' : 'sealed',
      }))}
      columns={[
        {
          cellsClassName: classes.name,
          accessor: 'name',
          title: t('components.auctionsTable.columns.name'),
          textAlign: 'center',
          ellipsis: true,
          width: 110
        },
        {
          cellsClassName: classes.cell,
          accessor: 'status',
          sortable: true,
          title: t('components.auctionsTable.columns.status'),
          textAlign: 'center',
          width: 110,
          render: (record) => <AuctionStatusBadge badgeStyle="loose" status={record.status as AuctionStatusType} />,
        },
        {
          cellsClassName: classes.cell,
          accessor: 'sectors',
          sortable: false,
          title: t('components.firmsTable.columns.sectors'),
          textAlign: 'center',
          width: 180,
          render: (record) => {
            const badges = useMemo(
              () =>
                (record.sectors as SectorType[])
                  .filter(
                    (sector) =>
                      SectorVariants[
                      sector.toLowerCase() as SectorType
                      ],
                  )
                  .map((sector) => (
                    <SectorBadge key={sector} sector={sector} />
                  )),
              [record.sectors],
            );

            return (
              <HoverCard position="top" disabled={badges.length <= 1}>
                <HoverCard.Target>
                  <Group>
                    {badges[0]}
                    {badges.length > 1 && (
                      <Badge variant="light">
                        +{badges.length - 1}
                      </Badge>
                    )}
                  </Group>
                </HoverCard.Target>
                <HoverCard.Dropdown className="flex flex-row gap-1">
                  {badges.slice(1).map((badge) => badge)}
                </HoverCard.Dropdown>
              </HoverCard>
            );
          },
        },
        {
          cellsClassName: classes.cell,
          accessor: 'bidders',
          title: t('components.auctionsTable.columns.bidders'), 
          textAlign: 'center',
          width: 75
        },
        { cellsClassName: classes.cell,
          accessor: 'bids', title: t('components.auctionsTable.columns.bids'), 
          textAlign: 'center',width: 60 

        },
        {
          cellsClassName: classes.cell,
          accessor: 'type',
          sortable: true,
          title: t('components.auctionsTable.columns.type'),
          textAlign: 'center',
          width: 120,
          render: (record) => (
            <AuctionTypeBadge type={record.type as AuctionType} showOpen />
          ),
        }
      ]}
    />
  )
}

export { LatestAuctionsTable }