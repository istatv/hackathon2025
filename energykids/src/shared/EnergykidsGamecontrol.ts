import { Player } from "./Player";

export class EnergykidsGamecontrol {

    private static instance: EnergykidsGamecontrol | null = null;

    public static GameState = {
        BEFORE_GAME: "BEFORE_GAME",
        INGAME_LOBBY: "INGAME_LOBBY",
        INGAME_MINI: "INGAME_MINI",
        FINAL: "FINAL"
    };
    
    private players: Player[];
    private totalScoreGoal: number = -1;

    constructor() {
        this.init();
    }

    private init() {
        this.players = [
            new Player(),
            new Player(),
        ];
    }

    reset() {
        this.init();
    }


    getPlayerAt(idx: number) : Player {
        return this.players[idx];
    }

    getTotalScoreGoal() : number {
        return this.totalScoreGoal;
    }

    getTotalScore() : number {
        let totalScore = 0;
        for (const player of this.players) {
            totalScore += player.getScore();
        }
        return totalScore;
    }

    getCurrentGameProgress() : number {
        const total = this.players.reduce((p,c) => p + c.score, 0);
        return total / this.getTotalScoreGoal();
    }

    setTotalScoreGoal(scoreGoal: number) {
        this.totalScoreGoal = scoreGoal;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    // Singleton access method
    public static getInstance(): EnergykidsGamecontrol {
        if (!EnergykidsGamecontrol.instance) {
            EnergykidsGamecontrol.instance = new EnergykidsGamecontrol();
        }
        return EnergykidsGamecontrol.instance;
    }

}
