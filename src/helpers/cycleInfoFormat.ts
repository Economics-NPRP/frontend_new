export const toIsoUtcMicro = (input: (Date | string) = new Date()): string => {
  if (typeof input === "string") {
    const test = "2025-09-27 13:00:00"
    const [date, time] = test.split(" ")
    const dateAsArr = date.split("-")
    const year = dateAsArr[0]
    const month = dateAsArr[1]
    const day = dateAsArr[2]
    const timeAsArr = time.split(":")
    const hour = timeAsArr[0]
    const minute = timeAsArr[1]
    const second = timeAsArr[2]
    const micro = "000000"
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${micro}+00:00`
  } else {
    const d = new Date(input);
    const pad2 = (n: number) => String(n).padStart(2, "0");
  
    const year = d.getUTCFullYear();
    const month = pad2(d.getUTCMonth() + 1);
    const day = pad2(d.getUTCDate());
    const hour = pad2(d.getUTCHours());
    const minute = pad2(d.getUTCMinutes());
    const second = pad2(d.getUTCSeconds());
  
    const micro = String(d.getUTCMilliseconds() * 1000).padStart(6, "0");
  
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${micro}+00:00`;
  }
}
