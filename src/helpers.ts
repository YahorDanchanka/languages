export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
export const removeReactivity = (obj: any) => JSON.parse(JSON.stringify(obj))
