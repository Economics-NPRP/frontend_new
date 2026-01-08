'use client'

import { useContext, useEffect, useMemo } from 'react'
import { useTranslations, useFormatter } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { DateTime } from 'luxon'
import { useSMAuctionAction } from 'hooks/useSMAuctionAction'
import { SingleAuctionContext } from 'contexts/SingleAuction'
import { useAuctionAvailability } from 'hooks/useAuctionAvailability'
import { useMediaQuery } from '@mantine/hooks'
import {
  Divider,
  Stack,
  Flex,
  Button,
  Text,
  Group,
  Title,
  Avatar,
  Anchor,
  Skeleton,
  UnstyledButton,
  Container
} from '@mantine/core'
import {
  IconCheck,
  IconX,
  IconHammerOff,
  IconHourglassEmpty,
  IconLeaf,
  IconClock,
  IconAlarm,
  IconEye,
  IconBuildingBank,
  IconGavel,
  IconBookmark,
  IconSlash,
  IconLicense
} from '@tabler/icons-react'

import { AuctionTypeBadge, EndingSoonBadge, SectorBadge, CurrencyBadge } from 'components/Badge'
import { Id } from 'components/Id'
import { Switch } from 'components/SwitchCase'
import { WithSkeleton } from 'components/WithSkeleton'
import { LargeCountdown } from 'components/Countdown'

import classes from './styles.module.css'

const Properties = () => {
  const t = useTranslations();
  const auction = useContext(SingleAuctionContext);
  const { areBidsAvailable } = useAuctionAvailability();

  return (
    <Stack className={`${classes.properties} ${classes.section}`}>
      <Divider
        label={t('marketplace.auction.details.details.properties.title')}
        classNames={{
          root: classes.divider,
          label: classes.label,
        }}
      />
      <Stack className={classes.table}>
        <Group className={classes.row}>
          <Group className={classes.cell}>
            <IconHourglassEmpty size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.permitLifespan.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {t('constants.quantities.years.default', { value: 1 })}
              </Text>
            </WithSkeleton>
          </Group>
          <Group className={classes.cell}>
            <IconLeaf size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.emissionsPerPermit.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {t('constants.quantities.emissions.default', { value: 10000 })}
              </Text>
            </WithSkeleton>
          </Group>
        </Group>
        <Group className={classes.row}>
          <Group className={classes.cell}>
            <IconClock size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.startDate.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {DateTime.fromISO(auction.data.startDatetime).toLocaleString(
                  DateTime.DATETIME_SHORT,
                )}
              </Text>
            </WithSkeleton>
          </Group>
          <Group className={classes.cell}>
            <IconAlarm size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.endDate.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {DateTime.fromISO(auction.data.endDatetime).toLocaleString(
                  DateTime.DATETIME_SHORT,
                )}
              </Text>
            </WithSkeleton>
          </Group>
        </Group>
        <Group className={classes.row}>
          <Group className={classes.cell}>
            <IconEye size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.views.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {t('constants.quantities.views.default', { value: 0 })}
              </Text>
            </WithSkeleton>
          </Group>
          <Group className={classes.cell}>
            <IconBuildingBank size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.bidders.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {t('constants.quantities.bidders.default', {
                  value: auction.data.biddersCount,
                })}
              </Text>
            </WithSkeleton>
          </Group>
        </Group>
        <Group className={classes.row}>
          <Group className={classes.cell}>
            <IconGavel size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.bids.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {areBidsAvailable
                  ? t('constants.quantities.bids.default', {
                    value: auction.data.bidsCount,
                  })
                  : 'N/A'}
              </Text>
            </WithSkeleton>
          </Group>
          <Group className={classes.cell}>
            <IconBookmark size={16} className={classes.icon} />
            <Text className={classes.key}>
              {t('marketplace.auction.details.details.properties.bookmarks.key')}
            </Text>
            <WithSkeleton loading={auction.isLoading} width={120} height={24}>
              <Text className={classes.value}>
                {t('constants.quantities.bookmarks.default', { value: 0 })}
              </Text>
            </WithSkeleton>
          </Group>
        </Group>
      </Stack>
    </Stack>
  );
};

const Card = () => {
  const t = useTranslations();
  const format = useFormatter();
  const isMobile = useMediaQuery('(max-width: 48em)');
  const auction = useContext(SingleAuctionContext);

  const { isUpcoming, hasEnded, isLive } = useAuctionAvailability();

  const currentState = useMemo(() => {
    if (auction.isLoading) return 'loading';
    if (isUpcoming) return 'upcoming';
    if (isLive) return 'live';
    if (hasEnded) return 'ended';
  }, [auction.isLoading, isUpcoming, isLive, hasEnded]);

  return (
    <Stack className={classes.card}>
      <Container className={classes.container}>
        <Container className={classes.image}>
          <Image
            src={auction.data.image || '/imgs/industry/flare.jpg'}
            alt={'Image of a power plant'}
            fill
          />
        </Container>
      </Container>
      <Group className={classes.row}>
        <Switch value={auction.isLoading}>
          <Switch.True>
            <Stack className={classes.section}>
              <Text className={classes.subtext}>
                {isMobile
                  ? t('constants.permitsOffered.short')
                  : t('constants.permitsOffered.full')}
              </Text>
              <Skeleton width={120} height={24} data-dark visible />
            </Stack>
            <Stack className={classes.section}>
              <Text className={classes.subtext}>
                {isMobile
                  ? t('constants.minWinningBid.short')
                  : t('constants.minWinningBid.med')}
              </Text>
              <Skeleton width={120} height={24} data-dark visible />
            </Stack>
            <Stack className={classes.section}>
              <Text className={classes.subtext}>
                {isMobile
                  ? t('constants.minBidIncrement.short')
                  : t('constants.minBidIncrement.med')}
              </Text>
              <Skeleton width={120} height={24} data-dark visible />
            </Stack>
          </Switch.True>
          <Switch.False>
            <Stack className={classes.section}>
              <Text className={classes.subtext}>
                {isMobile
                  ? t('constants.permitsOffered.short')
                  : t('constants.permitsOffered.full')}
              </Text>
              <Group className={classes.price}>
                <Container className={classes.icon}>
                  <IconLicense size={14} />
                </Container>
                <Text className={classes.value}>
                  {format.number(auction.data.permits)}
                </Text>
              </Group>
            </Stack>
            <Stack className={classes.section}>
              <Text className={classes.subtext}>
                {isMobile
                  ? t('constants.minWinningBid.short')
                  : t('constants.minWinningBid.med')}
              </Text>
              <Group className={classes.price}>
                <CurrencyBadge className={classes.badge} />
                <Text className={classes.value}>
                  {format.number(auction.data.minBid, 'money')}
                </Text>
              </Group>
            </Stack>
            <Stack className={classes.section}>
              <Text className={classes.subtext}>
                {isMobile
                  ? t('constants.minBidIncrement.short')
                  : t('constants.minBidIncrement.med')}
              </Text>
              <Group className={classes.price}>
                <CurrencyBadge className={classes.badge} />
                <Text className={classes.value}>{format.number(1, 'money')}</Text>
              </Group>
            </Stack>
          </Switch.False>
        </Switch>
      </Group>
      <Switch value={currentState}>
        <Switch.Loading>
          <Stack className={classes.countdown}>
            <LargeCountdown targetDate={auction.data.startDatetime} loading />
          </Stack>
        </Switch.Loading>
        <Switch.Upcoming>
          <Stack className={classes.countdown}>
            <Text className={classes.title}>
              {t('constants.auctionStatus.startingIn.label')}
            </Text>
            <LargeCountdown targetDate={auction.data.startDatetime} />
            <Text className={classes.subtext}>
              {DateTime.fromISO(auction.data.startDatetime).toLocaleString(
                DateTime.DATETIME_FULL,
              )}
            </Text>
          </Stack>
        </Switch.Upcoming>
        <Switch.Live>
          <Stack className={classes.countdown}>
            <Text className={classes.title}>
              {t('constants.auctionStatus.endingIn.label')}
            </Text>
            <LargeCountdown targetDate={auction.data.endDatetime} />
            <Text className={classes.subtext}>
              {DateTime.fromISO(auction.data.endDatetime).toLocaleString(
                DateTime.DATETIME_FULL,
              )}
            </Text>
          </Stack>
        </Switch.Live>
        <Switch.Ended>
          <Stack className={classes.countdown}>
            <Text className={classes.title}>
              {t('constants.auctionStatus.auctionEnded.label')}
            </Text>
            <LargeCountdown targetDate={auction.data.endDatetime} />
            <Text className={classes.subtext}>
              {DateTime.fromISO(auction.data.endDatetime).toLocaleString(
                DateTime.DATETIME_FULL,
              )}
            </Text>
          </Stack>
        </Switch.Ended>
      </Switch>
    </Stack>
  );
}

const Auction = () => {
  const auction = useContext(SingleAuctionContext)
  const { approve, reject, execute } = useSMAuctionAction();

  useEffect(() => {
    console.log('Auction context updated:', auction.data.secondaryApproval);
  }, [auction])

  return (
    <Stack gap={0} className={classes.root}>
      <Flex gap={16} className={classes.actions}>
        {auction.data.secondaryApproval && auction.data.secondaryApproval.status === "pending" && <>
          <Button
            variant='outline'
            color="green.7"
            onClick={() => approve.mutate({ auctionId: auction.id })}
            loading={approve.isPending}
            className={classes.action}
          >
            <Flex align="center" gap={8}>
              <IconCheck size={16} />
              <Text className={classes.label} span>Approve</Text>
            </Flex>
          </Button>
          <Button
            variant='outline'
            color="red.7"
            onClick={() => reject.mutate({ auctionId: auction.id })}
            loading={reject.isPending}
            className={classes.action}
          >
            <Flex align="center" gap={8}>
              <IconX size={16} />
              <Text className={classes.label} span>Reject</Text>
            </Flex>
          </Button>
        </>
        }
        {auction.data.secondaryApproval && auction.data.secondaryApproval.status === "approved" && 
        <Button
          variant='outline'
          color="gray.7"
          onClick={() => execute.mutate({ auctionId: auction.id })}
          loading={execute.isPending}
          className={classes.action}
        >
          <Flex align="center" gap={8}>
            <IconHammerOff size={16} />
            <Text className={classes.label} span>Execute</Text>
          </Flex>
        </Button>}
      </Flex>
      <Divider mt={16} mb={24} />
      <Flex className={classes.content}>
        <Card />
        <Stack className={`${classes.details} ${classes.section}`}>
          <WithSkeleton loading={auction.isLoading} width={360} height={40}>
            <Title className={classes.title}>{auction.data.title.split(" - ")[0]}</Title>
          </WithSkeleton>
          <Group className={classes.row}>
            <Group className={classes.cell}>
              <SectorBadge sector={auction.data.sector} loading={auction.isLoading} />
              <AuctionTypeBadge type={auction.data.type} loading={auction.isLoading} />
            </Group>
            <Group className={classes.cell}>
              <EndingSoonBadge auction={auction.data} />
            </Group>
          </Group>
          <Switch value={auction.isLoading}>
            <Switch.True>
              <Stack className="gap-2">
                <Skeleton height={16} visible />
                <Skeleton height={16} visible />
                <Skeleton height={16} visible />
              </Stack>
            </Switch.True>
            <Switch.False>
              <Text className={classes.description}>
                {auction.data.description ||
                  ''}
              </Text>
            </Switch.False>
          </Switch>
          <Group className={classes.row}>
            <Group className={classes.owner}>
              <WithSkeleton loading={auction.isLoading} width={40} height={40} circle>
                <Avatar
                  className={classes.avatar}
                  name={auction.data.owner && auction.data.owner.name}
                />
              </WithSkeleton>
              <WithSkeleton loading={auction.isLoading} width={160} height={24}>
                <Anchor
                  className={classes.link}
                  component={Link}
                  href={`/marketplace/firm/${auction.data.ownerId}`}
                >
                  {auction.data.owner && auction.data.owner.name}
                </Anchor>
              </WithSkeleton>
            </Group>
            <WithSkeleton loading={auction.isLoading} width={260} height={14}>
              <Id
                className={classes.id}
                value={auction.data.id}
                variant={auction.data.sector}
              />
            </WithSkeleton>
          </Group>
          <Switch value={auction.isLoading}>
            <Switch.True>
              <UnstyledButton className={classes.cycle}>
                <Stack className={classes.left}>
                  <Skeleton visible width={200} height={24} className="my-0.5" />
                  <Skeleton visible width={240} height={14} className="my-0.5" />
                </Stack>
                <IconSlash size={28} className={classes.icon} />
                <Group className={classes.right}>
                  <SectorBadge loading sector="energy" />
                </Group>
              </UnstyledButton>
            </Switch.True>
            <Switch.False>
              {auction.data.cycle && (
                <UnstyledButton
                  className={classes.cycle}
                  component={Link}
                  href={`#`}
                >
                  <Stack className={classes.left}>
                    <Text className={classes.title}>
                      {auction.data.cycle.title}
                    </Text>
                    <Text className={classes.description}>
                      {auction.data.cycle.description}
                    </Text>
                  </Stack>
                  <IconSlash size={28} className={classes.icon} />
                  <Group className={classes.right}>
                    {auction.data.cycle.sectors
                      .sort((sector) => (auction.data.sector === sector ? 1 : -1))
                      .map((sector) => (
                        <SectorBadge key={sector} sector={sector} hideText />
                      ))}
                  </Group>
                </UnstyledButton>
              )}
            </Switch.False>
          </Switch>
          <Properties />
        </Stack>
      </Flex>
    </Stack>
  )
}

export default Auction