import { useMemo } from "react"
import { DataTable } from "mantine-datatable"
import { SectorVariants } from "@/constants/SectorData"
import { SectorType } from "@/schema/models"
import { SectorBadge } from "@/components/Badge"
import { HoverCard, Group, Badge, Stack, Text } from "@mantine/core"
import { useTranslations } from "next-intl"
import { AuctionTypeBadge } from "@/components/Badge"
import { AuctionType } from "@/schema/models"
import { AuctionStatusBadge, AuctionStatusType } from "@/components/Badge"
import classes from './styles.module.css'
import { useRouter } from "next/navigation"
import { HomeAuctionData } from "hooks/useAdminHomeData"
import { IconDots } from "@tabler/icons-react"

type LatestAuctionsTableProps = {
  className?: string;
  records?: HomeAuctionData[] | null;
  loading?: boolean;
}

const LatestAuctionsTable = ({ className, records, loading }: LatestAuctionsTableProps) => {
  const t = useTranslations()
  const router = useRouter()
  const handleRoute = () => {
    router.push('/dashboard/a/cycles/auctions')
  }
  if (!records || records.length === 0) return null

  return loading ? (
  <>
    <Stack align="center" gap={16} className={classes.fallback}>
      <IconDots size={32} />
      <Text span>Loading Firm Applications...</Text>
    </Stack>
  </>) : (
    <DataTable
      className={classes.latestAuctions + ' ' + (className || '')}
      classNames={{
        header: classes.header
      }}
      onRowClick={handleRoute}
      height={96*4-16}
      fetching={loading || records === null}
      records={records}
      columns={[
        {
          cellsClassName: classes.name,
          accessor: 'name',
          title: t('components.auctionsTable.columns.name'),
          textAlign: 'left',
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
                ([record.sector] as SectorType[])
                  .filter(
                    (sector) =>
                      SectorVariants[
                      sector.toLowerCase() as SectorType
                      ],
                  )
                  .map((sector) => (
                    <SectorBadge key={sector} sector={sector} />
                  )),
              [record.sector],
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