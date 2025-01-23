import { Scene } from 'phaser'
import { loadLobbyAssets } from '../shared/assets/LobbyAssets.ts'
import { loadPushButtonAssets } from '../shared/assets/PushButtonAssets.ts'
import { loadCatchGameAssets } from '../shared/assets/CatchGameAssets.ts'

export class Preloader extends Scene {
    constructor() {
        super('Preloader')
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background')

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)

        this.add.text(0, +this.game.config.height / 2 - 100, 'Loading', {
            fontFamily: 'MightySoul',
            fontSize: '56px',
            color: 'white',
            align: 'center',
            fixedWidth: 1024,
        })

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress
        })
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets')
        loadLobbyAssets(this.load)
        loadPushButtonAssets(this.load)
        loadCatchGameAssets(this.load)
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        this.scene.start('CatchGame')
    }
}
