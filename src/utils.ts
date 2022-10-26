import { lookup } from 'geoip-lite'

export class Utils {
    getCountry(ip: string): string {
        return lookup(ip)?.country || 'ZZ'
    }
}