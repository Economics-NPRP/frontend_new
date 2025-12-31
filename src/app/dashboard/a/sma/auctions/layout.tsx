import { withProviders } from "@/helpers";
import { ListSecondaryMarketApprovalsProvider } from "@/contexts";
import { ReactNode } from "react";

export default function Layout({ children, list }: { children: ReactNode, list: ReactNode }) {
  return withProviders(
    <>
      {children}
      {list}
    </>,
    { provider: ListSecondaryMarketApprovalsProvider }
  );
}
