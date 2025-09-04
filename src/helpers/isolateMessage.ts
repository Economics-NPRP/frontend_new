export const isolateMessage = (msg:string):string => {
  if (!msg) return ""
  let start = false;
  let result = ""
  for(let i = 0; i < msg.length; i++) {
    if (msg.substring(i, Math.min(i + 10, msg.length)) === "\"errors\":[") {
      start = true;
      i += 11;
    }
    if (start && msg[i] === "\"") return result
    if (start) {
      result += msg[i];
    }
  }
  return msg
}