import { Scene } from 'phaser'

export class MinigameIntro extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image

    constructor() {
        super('MinigameIntro')
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000)

        this.background = this.add.image(512, 384, 'background')
        this.background.setAlpha(0.5)

        this.add
            .text(
                0,
                0,
                'Our car has no energy anymore! You need to ride the bicycle as fast as you can to recharge it!'
            )
            .setOrigin(0.5, 0.5)
    }
}
