import { createReadStream, ReadStream } from 'fs'
import { lookup } from 'geoip-lite'
import { ClientRequest, request, RequestOptions } from 'http'
import { createInterface } from 'readline'
import { Observable } from 'rxjs'
import { Readable } from 'stream'

export interface IProxy {
    host: string
    port: number
    country: string
    proxyAuth?: string
    ms?: number
}

export class Utils {
    getCountry(ip: string): string {
        return lookup(ip)?.country || 'ZZ'
    }

    fileReadStream(path: string): ReadStream {
        return createReadStream(path)
    }

    readline$(input: Readable): Observable<string> {
        return new Observable<string>((observer) => {
            const rl = createInterface(input)
            rl.on('line', line => observer.next(line))
            rl.on('error', err => observer.error(err))
            rl.on('close', () => observer.complete())

            return {
                unsubscribe() {
                    rl.close()
                }
            }
        })
    }

    nowInMs(): number {
        const now = process.hrtime()
        return now[0] * 1000 + now[1] / 1000000
    }

    newRequest(options: RequestOptions): ClientRequest {
        return request(options)
    }
}