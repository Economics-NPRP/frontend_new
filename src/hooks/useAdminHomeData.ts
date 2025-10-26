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

export function useAdminHomeData() {
  const t = useTranslations();
  const cycle = useContext(PaginatedAuctionCyclesContext);
  const firmApplications = useContext(PaginatedFirmApplicationsContext)
  const auctions = useContext(PaginatedAuctionsContext)

  const [loading, setLoading] = useState<boolean[]>([true, true, true]);
  
  useEffect(() => {
    setLoading([cycle.isLoading, firmApplications.isLoading, auctions.isLoading]);
  }, [cycle.isLoading, firmApplications.isLoading, auctions.isLoading]);

  const [chartData, setChartData] = useState<{
    name: string;
    value: number;
    color: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
    opacity: number;
  }[]>([]);

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
  }, [cycle, t, getTranslatedName, firmApplications, auctions]);

  return { 
    chartData, 
    loading, 
    cycles: (cycle && cycle.data && cycle.data.results || []), 
    firmApplications: (firmApplications && firmApplications.data && firmApplications.data.results || []),
    auctions: (auctions && auctions.data && auctions.data.results || []),
  }
}