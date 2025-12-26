'use client'

import { useTranslations } from "next-intl";
import { useContext, useState, useCallback, useEffect } from "react";
import { PaginatedAuctionCyclesContext } from "contexts/PaginatedAuctionCycles";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon, IconProps } from "@tabler/icons-react";
import { IAuctionData } from "@/schema/models";
import { SectorVariants } from "@/constants/SectorData";
import { SectorType } from "@/schema/models";
import { buildChartData } from "@/lib/homepages/buildChartData";
import { PaginatedFirmApplicationsContext } from "contexts/PaginatedFirmApplications";
import { PaginatedAuctionsContext } from "contexts/PaginatedAuctions";
import { AuctionStatusType } from "@/components/Badge";

export type HomeFirmApplication = {
  crn: string;
  companyName: string;
  applicationDate: string;
  sectors: SectorType[];
  status: 'pending' | 'approved' | 'rejected';
}
export type HomeAuctionData = {
  name: string;
  status: string;
  sector: SectorType;
  bidders: number;
  bids: number;
  type: string;
}

export function useAdminHomeData() {
  const t = useTranslations();
  const cycle = useContext(PaginatedAuctionCyclesContext);
  const firmApplications = useContext(PaginatedFirmApplicationsContext)
  const auctions = useContext(PaginatedAuctionsContext)

  const [loading, setLoading] = useState<boolean[]>([true, true, true]);
  const [applications, setApplications] = useState<HomeFirmApplication[]>([])
  const [auctionList, setAuctionList] = useState<HomeAuctionData[]>([])
  
  useEffect(() => {
    setLoading([cycle.isLoading, firmApplications.isLoading, auctions.isLoading]);
  }, [cycle.isLoading, firmApplications.isLoading, auctions.isLoading]);

  const [chartData, setChartData] = useState<{
    name: string;
    value: number;
    color: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
    opacity: number;
  }[]>([]);
  
  const getApplications = () => {
    if (!firmApplications || !firmApplications.data || firmApplications.data.results.length === 0) return [];
    const result: HomeFirmApplication[] = []
    for (const application of firmApplications.data.results) {
      result.push({
        crn: ''+application.crn,
        companyName: application.companyName,
        applicationDate: new Date(application.createdAt).toLocaleString(),
        sectors: application.sectors,
        status: application.status,
      })
    }
    return result;
  }

  const auctionStatus = (auction:IAuctionData):AuctionStatusType => {
    const start = new Date(auction.startDatetime).getTime();
    const end = new Date(auction.endDatetime).getTime();
    const now = Date.now();

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    if (now > end) return 'ended';
    return 'ended';
  }

  const getAuctions = () => {
    if (!auctions || !auctions.data || auctions.data.results.length === 0) return [];
    const result: HomeAuctionData[] = []
    for (const auction of auctions.data.results) {
      result.push({
        name: auction.title,
        status: auctionStatus(auction),
        sector: auction.sector as SectorType,
        bidders: auction.biddersCount,
        bids: auction.bidsCount,
        type: auction.type,
      })
    }
    return result;
  }

  const getTranslatedName = useCallback((name: string) => {
    switch (name) {
      case 'energy': return t('constants.sector.energy.title');
      case 'industry': return t('constants.sector.industry.title');
      case 'transport': return t('constants.sector.transport.title');
      case 'buildings': return t('constants.sector.buildings.title');
      case 'waste': return t('constants.sector.waste.title');
      case 'agriculture': return t('constants.sector.agriculture.title');
      default: return name;
    }
  }, [t])

  useEffect(() => {
    if (cycle.data && loading[0] && cycle.data.results.length > 0) {
      const defaultChartData = [
        {
          id: 'energy',
          title: t('constants.sector.energy.title'),
          permits: 0,
          emissions: 0,
          auctions: 0,
        },
        {
          id: 'industry',
          title: t('constants.sector.industry.title'),
          permits: 0,
          emissions: 0,
          auctions: 0,
        },
        {
          id: 'transport',
          title: t('constants.sector.transport.title'),
          permits: 0,
          emissions: 0,
          auctions: 0,
        },
        {
          id: 'buildings',
          title: t('constants.sector.buildings.title'),
          permits: 0,
          emissions: 0,
          auctions: 0,
        },
        {
          id: 'waste',
          title: t('constants.sector.waste.title'),
          permits: 0,
          emissions: 0,
          auctions: 0,
        },
        {
          id: 'agriculture',
          title: t('constants.sector.agriculture.title'),
          permits: 0,
          emissions: 0,
          auctions: 0,
        },
      ]
      const newChartData = buildChartData(
        ((cycle.data.results[0].auctions as unknown) as IAuctionData[] || defaultChartData),
        getTranslatedName
      ).map((item) => ({
        name: item.title,
        value: item['auctions'],
        color: SectorVariants[item.id as SectorType]!.color.hex!,
        icon: SectorVariants[item.id as SectorType]!.Icon,
        opacity: 0.6,
      }))
      setChartData(newChartData);
    } 
    else if (firmApplications.data && loading[1] && firmApplications.data.results.length > 0) {
      const applicationsData = getApplications();
      setApplications(applicationsData);
    } else if (auctions.data && loading[2] && auctions.data.results.length > 0) {
      const auctionsData = getAuctions();
      setAuctionList(auctionsData);
    }
  }, [cycle, t, getTranslatedName, firmApplications, auctions, getApplications, getAuctions, loading]);

  return { 
    chartData, 
    loading,
    cycles: (cycle && cycle.data && cycle.data.results || []), 
    firmApplications: (applications.length > 0 ? applications : []),
    auctions: (auctionList.length > 0 ? auctionList : []),
  }
}