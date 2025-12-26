import { IconGavel, IconBolt } from "@tabler/icons-react";

const InfoBoxLabel = {
  "auction": "Total Auctions",
  "energy": "Energy Auctions",
  "industry": "Industry Auctions",
  "transport": "Transport Auctions",
  "buildings": "Buildings Auctions",
  "waste": "Waste Auctions",
  "agriculture": "Agriculture Auctions",
}

const InfoBoxIcons: TInfoBoxIcons = {
  "auction": IconGavel,
  "energy": IconBolt,
}

export type TInfoBoxIcons = {
  [key: string]: React.ForwardRefExoticComponent<import("@tabler/icons-react").IconProps & React.RefAttributes<SVGSVGElement>>;
}

export { InfoBoxLabel, InfoBoxIcons };