import { Player } from "./Player";

export class EnergykidsGamecontrol {

    private static instance: EnergykidsGamecontrol | null = null;

    public static GameState = {
        BEFORE_GAME: "BEFORE_GAME",
        INGAME_LOBBY: "LOBBY",
        INGAME_MINI: "GAME",
        FINAL: "BAZ"
    };
    
    public players: any[];
    public foo: number = 123;

    constructor() {
        this.players = [
            new Player(),
            new Player(),
        ];
    }

    getPlayerAt(idx: number) {
        return this.players[idx];
    }

    getTotalScore() : number {
        let totalScore = 0;
        for (const player of this.players) {
            totalScore += player.getScore();
        }
        return totalScore;
    }

    // Singleton access method
    public static getInstance(): EnergykidsGamecontrol {
        if (!EnergykidsGamecontrol.instance) {
            EnergykidsGamecontrol.instance = new EnergykidsGamecontrol();
        }
        return EnergykidsGamecontrol.instance;
    }

}
