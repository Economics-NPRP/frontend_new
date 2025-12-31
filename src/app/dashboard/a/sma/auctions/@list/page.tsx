'use client';
import { Stack } from "@mantine/core"
import { useContext, useEffect } from "react";
import { ListSecondaryMarketApprovalsContext } from "@/contexts";
import { SMAuctionApplication } from "./_components/SMAuctionApplication";

const SMAList = () => {
  const list = useContext(ListSecondaryMarketApprovalsContext);

  useEffect(() => {
    console.log('SMA List context updated:', list.data);
  }, [list])

  return (
    <Stack>
      {
        (list && list.data && Array.isArray(list.data) && list.data.length > 0) ? (
          list.data.map(application => (
            <SMAuctionApplication application={application} />
          ))
        ) : (
          <div>No data available</div>
        )
      }
    </Stack>
  )
}

export default SMAList