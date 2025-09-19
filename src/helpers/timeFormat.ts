export function toIsoUtcMicro(input:Date = new Date()):string {
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
