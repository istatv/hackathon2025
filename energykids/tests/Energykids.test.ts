import { EnergykidsGamecontrol } from '../src/shared/EnergykidsGamecontrol';
import { Player } from '../src/shared/Player';

describe('Testing Energykids Gamecontrol', () => {
  
    test('can create a Energykids Instance', () => {
        const game = new EnergykidsGamecontrol();
        expect(game).not.toBeUndefined();
        expect(game.players).toBeDefined();
    });

    test('can address players', () => {
        const game = new EnergykidsGamecontrol();
        expect(game.getPlayerAt).toBeDefined();
        expect(game.getPlayerAt(Player.FIRST)).toBeDefined();
        expect(game.getPlayerAt(20)).toBeUndefined();
        // expect(game.players).toBeDefined();
    });

});