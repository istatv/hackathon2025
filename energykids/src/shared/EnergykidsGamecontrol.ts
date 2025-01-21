import { Player } from "./Player";
export class EnergykidsGamecontrol {
    private static instance: EnergykidsGamecontrol | null = null

    public static GameState = {
        BEFORE_GAME: "BEFORE_GAME",
        INGAME_LOBBY: "INGAME_LOBBY",
        INGAME_MINI: "INGAME_MINI",
        FINAL: "FINAL"
    };

    public static LobbyEvent = {
        MINIGAME: "MINIGAME",
        DESASTER: "DESASTER",
    };

    private players: Player[];
    private totalScoreGoal: number = -1;
    private eventRegistry: any;

    constructor() {
        this.init();
        this.eventRegistry = {};
    }

    private init() {
        this.players = [
            new Player('Player One'),
            new Player('Player Two')
        ];
        this.setTotalScoreGoal(0);
    }

    reset() {
        this.init()
    }

    getPlayerAt(idx: number) : Player {
        return this.players[idx];
    }

    getTotalScoreGoal(): number {
        return this.totalScoreGoal
    }

    getTotalScore(): number {
        let totalScore = 0
        for (const player of this.players) {
            totalScore += player.getScore()
        }
        return totalScore
    }

    getCurrentGameProgress(): number {
        const total = this.players.reduce((p, c) => p + c.score, 0)
        return total / this.getTotalScoreGoal()
    }

    setTotalScoreGoal(scoreGoal: number) {
        this.totalScoreGoal = scoreGoal
    }

    getPlayers(): Player[] {
        return this.players
    }

    registerMinigame(identifier : string, scene: any) {
        const event = {
            type: EnergykidsGamecontrol.LobbyEvent.MINIGAME,
            identifier,
            scene,
            isActive: false,
        };

        this.eventRegistry[identifier] = event;
    }
    
    getLobbyEvents() : any {
        return this.eventRegistry;
    }

    randomLobbyEvent() : any {
        const keys  = Object.keys(this.eventRegistry);
        const keysAmount = keys.length - 1;
        const idx = Math.round(999999 * Math.random()) % keysAmount;
        const ident = keys[idx];
        return this.eventRegistry[ident];
    }

    // Singleton access method
    public static getInstance(): EnergykidsGamecontrol {
        if (!EnergykidsGamecontrol.instance) {
            EnergykidsGamecontrol.instance = new EnergykidsGamecontrol()
        }
        return EnergykidsGamecontrol.instance
    }
}
