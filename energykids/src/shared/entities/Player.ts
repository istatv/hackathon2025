export class Player {
    public static readonly FIRST: number = 0
    public static readonly SECOND: number = 1
    public static readonly THIRD: number = 2
    public static readonly FOURTH: number = 3

    public name: string
    public score: number

    constructor(name = 'Player', score = 0) {
        this.name = name
        this.score = score
    }

    addScore(amount: number) {
        this.score += amount
    }

    getScore(): number {
        return this.score
    }

    setName(name: string) {
        this.name = name
    }
}
