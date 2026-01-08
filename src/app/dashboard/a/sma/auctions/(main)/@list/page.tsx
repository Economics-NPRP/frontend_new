'use client';
import { Stack, Flex, Text } from "@mantine/core"
import { useContext, useEffect } from "react";
import { ListSecondaryMarketApprovalsContext } from "@/contexts";
import { SMAuctionApplication } from "./_components/SMAuctionApplication";
import { Placeholder } from "@/components/Placeholder";

import classes from "./styles.module.css"

const SMAList = () => {
  const list = useContext(ListSecondaryMarketApprovalsContext);

  useEffect(() => {
    console.log('SMA List context updated:', list.data);
  }, [list])

  return (
    <Stack mt={32}>
      {
        (list && list.data && Array.isArray(list.data.results) && list.data.results.length > 0) ? (
          <Flex className={classes.list} gap={16} w="fit-content">
            {list.data.results.map(application => (
              <SMAuctionApplication application={application} />
            ))}
          </Flex>
        ) :
        (list.isLoading) ? (
          <Placeholder state="loading" message="Loading auction applications..." />
        ) : (
          <Placeholder state="error" message="No data available" />
        )
      }
    </Stack>
  )
}

export default SMAList