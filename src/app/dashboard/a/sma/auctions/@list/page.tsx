'use client';
import { Stack, Text } from "@mantine/core"
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
        (list && list.data && Array.isArray(list.data.results) && list.data.results.length > 0) ? (
          list.data.results.map(application => (
            <SMAuctionApplication application={application} />
          ))
        ) : 
        list.isLoading ? (
          <Text className="paragraph-md">Loading...</Text>
        ) : (
          <Text className="paragraph-md">No data available</Text>
        )
      }
    </Stack>
  )
}

export default SMAList