import { RequestOptions } from "https"
import { Observable } from "rxjs"
import { IProxy, Utils } from "./utils"

export class Check {
    constructor(private utils: Utils) { }

    socks$(proxy: IProxy): Observable<IProxy> {
        return new Observable<IProxy>((observer) => {
            const proxy_options: RequestOptions = {
                host: proxy.host,
                port: proxy.port,
                method: 'CONNECT',
                path: 'www.google.com:443',
                timeout: 5000,
                agent: false
            }

            if (proxy.proxyAuth) {
                proxy_options.headers = {
                    'Proxy-Authorization': 'Basic ' + Buffer.from(proxy.proxyAuth).toString('base64')
                }
            }

            const startAt = this.utils.nowInMs()
            const req = this.utils.newRequest(proxy_options)
            req.on('connect', () => {
                observer.next({
                    ...proxy,
                    ms: this.utils.nowInMs() - startAt
                })
                observer.complete()
                req.destroy()
            })
            req.on('timeout', () => {
                observer.next(proxy)
                observer.complete()
                req.destroy()
            })
            req.on('error', (err) => {
                observer.next(proxy)
                observer.complete()
            })
            req.end()

            return {
                unsubscribe() {
                    if (!req.destroyed) {
                        req.destroy()
                    }
                },
            }
        })
    }

}