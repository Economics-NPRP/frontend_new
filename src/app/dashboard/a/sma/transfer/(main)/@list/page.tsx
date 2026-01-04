import { Stack } from "@mantine/core"
import Request from "./_components/Request"
import { DefaultPermitTransfer } from "@/schema/models/TransferRequestData"
const TransfersList = () => {
  return (
    <Stack>
      <Request request={DefaultPermitTransfer} />
    </Stack>
  )
}

export default TransfersList