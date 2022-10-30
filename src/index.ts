import { exit } from "process";
import { filter, map, merge, tap } from "rxjs";
import { Check } from "./check";
import { IProxy, Utils } from "./utils";

const argc = process.argv.length
if (argc < 3) {
    console.log('usage: find-proxy proxy-list.txt [countries to exclude]')
    exit()
}

const exclude: string[] = []
for (let i = 3; i < argc; i++) {
    exclude.push(process.argv[i])
}
if (exclude.length > 0) {
    console.log('ignored countries:', exclude.join(', '))
}

const utils = new Utils()
const input = utils.fileReadStream(process.argv[2])
const proxy$ = utils.readline$(input)
const check = new Check(utils)

const proxies: IProxy[] = []
proxy$.pipe(
    filter(line => line.split(':').length === 2),
    map(line => {
        const a = line.split(':')
        return { host: a[0], port: +a[1], country: utils.getCountry(a[0]) } as IProxy
    }),
    filter((proxy) => exclude.length === 0 || exclude.indexOf(proxy.country) === -1),
    tap((proxy) => proxies.push(proxy))
).subscribe({
    complete() {
        console.log(`Checking ${proxies.length} proxies...`)
        const active: IProxy[] = []
        merge(...proxies.map((p) => check.socks$(p))).pipe(
            filter(proxy => (proxy.ms ?? -1) !== -1),
            tap((proxy) => active.push(proxy))
        ).subscribe({
            complete() {
                console.log(`Active ${active.length} from worst to best:`)
                console.log(active.sort((a, b) => (b.ms ?? 0) - (a.ms ?? 0)))
            },
        })
    },
})