type PermitsWonProps = {
  bid: {
    id: string;
    bidId?: string;
    companyName: string;
    owner: string;
    bids: {
      total: number;
      approved: number;
      pending: number;
      rejected: number;
      locked: number;
      expired: number;
    }
  },
  loading: boolean;
  className?: string;
  select: (bid: IBidData | typeof demoData[0], checked: boolean) => void;
}