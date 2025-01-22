import { Scene } from 'phaser'

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

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress
        })
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets')

        this.load.svg([
            { key: 'kyo1', url: 'kyo2-06.svg' },
            { key: 'kyo2', url: 'kyo2-07.svg' },
            { key: 'lobby_score', url: 'Players_Name_Scoreboard.svg' },
            {
                key: 'city1',
                url: 'city/City_State_0_bad.svg',
                svgConfig: { scale: 1 },
            },
            {
                key: 'city2',
                url: 'city/City_State_33_ok.svg',
                svgConfig: { scale: 1 },
            },
            {
                key: 'city3',
                url: 'city/City_State_66_good.svg',
                svgConfig: { scale: 1 },
            },
            {
                key: 'city4',
                url: 'city/City_State_100_best.svg',
                svgConfig: { scale: 1 },
            },
            { key: 'life1', url: 'city/City_Life_Score_0.svg' },
            { key: 'life2', url: 'city/City_Life_Score_33.svg' },
            { key: 'life3', url: 'city/City_Life_Score_66.svg' },
            { key: 'life4', url: 'city/City_Life_Score_100.svg' },
            {
                key: 'button_start',
                url: 'buttons/Button_StartGame_default.svg',
            },
            {
                key: 'button_start_hover',
                url: 'buttons/Button_StartGame_hover_pressed.svg',
            },
            { key: 'button_exit', url: 'buttons/Button_ExitGame_default.svg' },
            {
                key: 'button_exit_hover',
                url: 'buttons/Button_ExitGame_dHover_pressed.svg',
            },
        ])
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        this.scene.start('Lobby')
    }
}
