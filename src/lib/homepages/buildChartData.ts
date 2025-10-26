import { IAuctionData } from '@/schema/models';

export interface IChartAuctionData extends IAuctionData {
  emissions?: number;
}
/**
 * Builds chart data aggregating permits, emissions, and auction counts by sector.
 * @param data - An array of auction data objects, each containing sector, permits, and emissions information.
 * @returns An array of objects, each representing a sector with its total permits, emissions, and auction count.
 * Each object has the following structure:
 * {
 *  id: string;
 * title: string;
 * permits: number;
 * emissions: number;
 * auctions: number;
 * }
 */
export function buildChartData(
  data: (IChartAuctionData | IAuctionData)[],
  getTranslatedName: (name: string) => string,
) {
  /* TODO: 1. create a hashmap with each key is a sector and value is the count */
  const sectorCountMap = new Map<
    string,
    {
      permits: number;
      emissions: number;
      auctions: number;
    }
  >();
  // Seed it with default sectors and 0 counts
  const defaultSectors = [
    'energy',
    'industry',
    'transport',
    'buildings',
    'waste',
    'agriculture',
  ];
  defaultSectors.forEach((sector) =>
    sectorCountMap.set(sector, {
      permits: 0,
      emissions: 0,
      auctions: 0,
    }),
  );
  // Feed the data into the map
  for (const auction of data) {
    const current = sectorCountMap.get(auction.sector) || {
      permits: 0,
      emissions: 0,
      auctions: 0,
    };
    sectorCountMap.set(auction.sector, {
      permits: current.permits + (auction.permits || 0),
      emissions: current.emissions + (auction.emissions || 0),
      auctions: current.auctions + 1,
    });
  }
  // Build the final array
  const result = [];
  for (const [sector, counts] of sectorCountMap.entries()) {
    if (!sector) continue
     result.push({
      id: sector,
      title: getTranslatedName(sector),
      ...counts,
    });
  }

  return result;
}
