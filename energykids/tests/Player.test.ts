import { Player } from '../src/shared/entities/Player'

describe('Testing Player', () => {
    test('can create a Player instance', () => {
        const player = new Player()
        expect(player).not.toBeUndefined()
        expect(player.name).toBeDefined()
        expect(player.score).toBeDefined()
        // expect(game.players).toBeDefined();
    })

    test('can have a score', () => {
        const player = new Player()
        expect(player).not.toBeUndefined()
        expect(player.score).toEqual(0)
        player.addScore(100)
        expect(player.score).toEqual(100)
        player.addScore(23)
        expect(player.score).toEqual(123)
    })

    // test('can player ', () => {
    //     const player = new Player();
    //     expect(player).not.toBeUndefined();
    //     expect(player.score).toEqual(0);
    //     player.addScore(100);
    //     expect(player.score).toEqual(100);
    //     player.addScore(23);
    //     expect(player.score).toEqual(123);
    // });
})
