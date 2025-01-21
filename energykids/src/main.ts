import { Boot } from './scenes/Boot'
import { Lobby as MainGame } from './scenes/Lobby.ts'
import { GameOver } from './scenes/GameOver'
import { MainMenu } from './scenes/MainMenu'
import { Preloader } from './scenes/Preloader'

import { Game, Types } from 'phaser'
import { PushButtonGame } from './scenes/minigames/PushButtonGame.ts'
import { MinigameIntro } from './scenes/minigames/MinigameIntro.ts'
import { CatchGame } from './scenes/minigames/CatchGame.ts'

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: generateAvailableScenes(),
}

function generateAvailableScenes() 
{
    const coreScenes = [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        MinigameIntro,
    ];

    const minigameScenes = [
        PushButtonGame,
        CatchGame,
    ];

    return [].concat(coreScenes, minigameScenes);
}

export default new Game(config)
