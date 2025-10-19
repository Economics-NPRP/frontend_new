'use client'
import { useTranslations } from "next-intl"
import { useCallback } from "react";
import { IAuctionData } from "@/schema/models";

interface IChartAuctionData extends IAuctionData {
  emissions: number;
}

export function buildChartData(data: IChartAuctionData[]) {
  const t = useTranslations();

  const getTranslatedName = useCallback((name:string) => {
    switch(name) {
      case 'energy':
        return t('constants.sector.energy.title');
      case 'industry':
        return t('constants.sector.industry.title');
      case 'transport':
        return t('constants.sector.transport.title');
      case 'buildings':
        return t('constants.sector.buildings.title');
      case 'waste':
        return t('constants.sector.waste.title');
      case 'agriculture':
        return t('constants.sector.agriculture.title');
      default:
        return name;
    }
  }, [t])

  return useCallback(() => {
    /* TODO: 1. create a hashmap with each key is a sector and value is the count */
    const sectorCountMap = new Map<string, {
      permits: number;
      emissions: number;
      auctions: number;
    }>();
    // Seed it with default sectors and 0 counts
    const defaultSectors = ['energy', 'industry', 'transport', 'buildings', 'waste', 'agriculture'];
    defaultSectors.forEach(sector => sectorCountMap.set(sector, {
      permits: 0,
      emissions: 0,
      auctions: 0,
    }));
    const result = []
    for(const auction of data) {
      sectorCountMap.set(auction.sector, {
        permits: (sectorCountMap.get(auction.sector)?.permits || 0) + (auction.permits || 0),
        emissions: (sectorCountMap.get(auction.sector)?.emissions || 0) + (auction.emissions || 0),
        auctions: (sectorCountMap.get(auction.sector)?.auctions || 0) + 1,
      });
    }
    // build result array
    for(const [sector, counts] of sectorCountMap.entries()) {
      result.push({
        id: sector,
        title: getTranslatedName(sector),
        ...counts,
      });
    }

    return result;
  }, [data, t])
}
