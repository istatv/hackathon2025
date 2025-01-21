import { Scene } from 'phaser'

export class Boot extends Scene {
    constructor() {
        super('Boot')
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png')
    }

    create() {
        // Add data to the registry
        this.registry.set('sceneConfig', {
            title: 'Push Button Game',
            description:
                'Our car has no energy anymore! You need to ride the bicycle as fast as you can to recharge it!',
        })

        this.scene.start('MinigameIntro')
    }
}
