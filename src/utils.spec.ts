import { Utils } from './utils'

describe('Utils', () => {
    let sut: Utils

    beforeEach(() => {
        sut = new Utils()
    })

    describe('getCountry', () => {
        it('0.0.0.0', () => {
            expect(sut.getCountry('0.0.0.0')).toEqual('ZZ')
        })

        it('8.8.8.8', () => {
            expect(sut.getCountry('8.8.8.8')).toEqual('US')
        })

        it('195.12.137.1', () => {
            expect(sut.getCountry('195.12.137.1')).toEqual('SK')
        })

        it('212.26.165.205', () => {
            expect(sut.getCountry('212.26.165.205')).toEqual('SK')
        })
    })
})