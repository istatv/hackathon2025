import { EnergykidsGamecontrol } from '../src/shared/EnergykidsGamecontrol';
import { Player } from '../src/shared/Player';

describe('Testing Energykids Gamecontrol', () => {
  
    test('can create a Energykids Instance', () => {
        const game = new EnergykidsGamecontrol();
        expect(game).not.toBeUndefined();
        expect(game.getPlayers).toBeDefined();
    });

    test('can provide the same instance via Singleotn', () => {
        const game = EnergykidsGamecontrol.getInstance();
        expect(game).not.toBeUndefined();
    });

    test('can reset the total gamestate', () => {
        const game = EnergykidsGamecontrol.getInstance();
        expect(game.reset).toBeDefined();

        let a = game.getPlayerAt(0);
        a.setName("foo");
        game.reset();

        let b = game.getPlayerAt(0);
        expect(a.name).not.toEqual(b.name);
    });

    test('can address players', () => {
        const game = new EnergykidsGamecontrol();
        expect(game.getPlayerAt).toBeDefined();
        expect(game.getPlayerAt(Player.FIRST)).toBeDefined();
        expect(game.getPlayerAt(20)).toBeUndefined();
    });

    test('can give a total playes count', () => {
        const game = new EnergykidsGamecontrol();
        expect(game.getPlayerAt).toBeDefined();
        expect(game.getPlayerAt(Player.FIRST)).toBeDefined();
        expect(game.getPlayerAt(20)).toBeUndefined();
        // expect(game.players).toBeDefined();
    });

    test('can have a total score goal', () => {
        const game = new EnergykidsGamecontrol();
        expect(game.getTotalScoreGoal).toBeDefined();
        expect(game.setTotalScoreGoal).toBeDefined();
        game.setTotalScoreGoal(9999);
        expect(game.getTotalScoreGoal()).toEqual(9999);
    });

    test('can have a current game progress', () => {
        const game = new EnergykidsGamecontrol();
        expect(game.getCurrentGameProgress).toBeDefined();
        game.setTotalScoreGoal(100);
        let a = game.getPlayerAt(Player.FIRST);
        a.addScore(50);
        expect(game.getCurrentGameProgress()).toEqual(0.5);
        // expect(game.getPlayerAt(20)).toBeUndefined();
        // expect(game.players).toBeDefined();
    });

});