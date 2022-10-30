import { ClientRequest } from 'http'
import { Check } from './check'
import { IProxy, Utils } from './utils'

describe('Check', () => {
    let sut: Check
    let utilsMock: jasmine.SpyObj<Utils>

    beforeEach(() => {
        utilsMock = jasmine.createSpyObj('utils', ['newRequest', 'nowInMs'])
        sut = new Check(utilsMock)
    })

    describe('socks$', () => {
        it('error', (done) => {
            const req: ClientRequest = new ClientRequest({})
            utilsMock.newRequest.and.returnValue(req)
            let proxy: IProxy = { host: '127.0.0.1', port: 54321, country: 'US' }

            let count = 0
            sut.socks$(proxy).subscribe({
                next: (value) => {
                    count++
                    expect(value).toEqual({
                        ...proxy,
                    })
                },
                complete: () => {
                    expect(count).toBe(1)
                    expect(utilsMock.nowInMs).toHaveBeenCalledTimes(1)
                    expect(utilsMock.newRequest).toHaveBeenCalledOnceWith({
                        host: '127.0.0.1',
                        port: 54321,
                        method: 'CONNECT',
                        path: 'www.google.com:443',
                        timeout: 5000,
                        agent: false
                    })
                    done()
                },
                error: () => {
                    fail('should not fail')
                },
            })
            req.emit('error', new Error('ignored'))
        })

        it('timeout', (done) => {
            const req: ClientRequest = new ClientRequest({})
            utilsMock.newRequest.and.returnValue(req)
            let proxy: IProxy = { host: '127.0.0.1', port: 54321, country: 'US' }

            let count = 0
            sut.socks$(proxy).subscribe({
                next: (value) => {
                    count++
                    expect(value).toEqual({
                        ...proxy,
                    })
                },
                complete: () => {
                    expect(count).toBe(1)
                    expect(utilsMock.nowInMs).toHaveBeenCalledTimes(1)
                    expect(utilsMock.newRequest).toHaveBeenCalledOnceWith({
                        host: '127.0.0.1',
                        port: 54321,
                        method: 'CONNECT',
                        path: 'www.google.com:443',
                        timeout: 5000,
                        agent: false
                    })
                    done()
                },
                error: () => {
                    fail('should not fail')
                },
            })
            req.emit('timeout', new Error('ignored'))
        })

        it('success', (done) => {
            utilsMock.nowInMs.and.returnValues(100, 421)
            const req: ClientRequest = new ClientRequest({})
            utilsMock.newRequest.and.returnValue(req)
            let proxy: IProxy = { host: '127.0.0.1', port: 54321, country: 'US' }

            let count = 0
            sut.socks$(proxy).subscribe({
                next: (value) => {
                    count++
                    expect(value).toEqual({
                        ...proxy,
                        ms: 321
                    })
                },
                complete: () => {
                    expect(count).toBe(1)
                    expect(utilsMock.nowInMs).toHaveBeenCalledTimes(2)
                    expect(utilsMock.newRequest).toHaveBeenCalledOnceWith({
                        host: '127.0.0.1',
                        port: 54321,
                        method: 'CONNECT',
                        path: 'www.google.com:443',
                        timeout: 5000,
                        agent: false
                    })
                    done()
                },
                error: () => {
                    fail('should not fail')
                },
            })
            req.emit('connect')
        })
    })
})