import { ReadStream } from 'fs'
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

    it('fileReadStream', () => {
        const actual = sut.fileReadStream('.gitignore')

        expect(actual).toBeTruthy()
    })

    it('readline$', (done) => {
        let lines = 0
        const input = ReadStream.from(['first\n', 'two\n', 'three\n', 'last\n'])

        sut.readline$(input).subscribe({
            next: (line) => {
                lines++
                if (lines === 1) {
                    expect(line).toBe('first')
                } else if (lines === 4) {
                    expect(line).toBe('last')
                }
            },
            complete: () => {
                expect(lines).toBe(4)
                done()
            },
            error: () => fail('should not fail'),
        })
    })

    it('nowInMs', () => {
        const past = process.hrtime()
        const pastInMs = past[0] * 1000 + past[1] / 1000000

        const actual = sut.nowInMs()

        expect(actual).toBeTruthy()
        expect(pastInMs).toBeLessThanOrEqual(actual)
    })

    it('newRequest', () => {
        const actual = sut.newRequest({
        })

        expect(actual).toBeTruthy()
    })
})