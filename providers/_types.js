/**
 * @typedef {Object} ProviderContext
 * @property {'http'} transport
 * @property {(url: string, opts?: object) => Promise<any>} fetchJson
 * @property {(url: string, opts?: object) => Promise<string>} fetchText
 *
 * @typedef {Object} Provider
 * @property {string} id
 * @property {(entry: any) => ({url: string} | null)=} detect
 * @property {(entry: any, ctx: ProviderContext) => Promise<Array<{title: string, url: string, company: string, location: string}>>} fetch
 */

export {};
