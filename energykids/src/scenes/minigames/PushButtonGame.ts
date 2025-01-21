import { Player } from '../../entities/Player.ts'
import Rectangle = Phaser.GameObjects.Rectangle
import SPACE = Phaser.Input.Keyboard.KeyCodes.SPACE
import TimeStep = Phaser.Core.TimeStep

export class PushButtonGame extends Phaser.Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image
    msg_text: Phaser.GameObjects.Text
    time_step_player1: Phaser.Core.TimeStep
    time_step_player2: Phaser.Core.TimeStep

    playerOne = new Player()
    playerTwo = new Player()

    private static AMOUNT_TO_INCREASE = 50
    private static MAX_WIDTH = 800
    private static REDUCTION_SPEED = 0.05

    private rectangle_player1: Phaser.GameObjects.Rectangle
    private rectangle_player2: Phaser.GameObjects.Rectangle

    constructor() {
        super('PushButtonGame')
    }

    create() {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000)

        this.msg_text = this.add
            .text(0, 0, 'Press space as fast as you can!', {
                font: '"Press Start 2P"',
            })
            .setOrigin(0, 0.5)

        this.background = this.add.image(512, 384, 'background')
        this.background.setAlpha(0.5)

        this.rectangle_player1 = this.add.rectangle(100, 100, 50, 50, 0xff7448)
        this.rectangle_player2 = this.add.rectangle(100, 200, 50, 50, 0xff7335)

        this.time_step_player1 = this.time_step_player2 = new TimeStep(
            this.game,
            {
                smoothStep: true,
            }
        )
        this.time_step_player1.start((time, delta) =>
            this.reduceBar(delta, this.rectangle_player1)
        )
        this.time_step_player2.start((time, delta) =>
            this.reduceBar(delta, this.rectangle_player2)
        )

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.buttonPush()
        })
    }

    reduceBar(delta, rectangle) {
        rectangle.width -= delta * PushButtonGame.REDUCTION_SPEED
        if (rectangle.width <= 0) {
            rectangle.width = 0
        }
    }

    buttonPush() {
        if (this.rectangle.width < PushButtonGame.MAX_WIDTH) {
            this.rectangle.width += PushButtonGame.AMOUNT_TO_INCREASE
        } else {
            this.gameWon()
        }
    }

    gameWon() {
        this.add.text(
            200,
            200,
            'You win! Press enter to return to the lobby.',
            {
                color: 'red',
            }
        )
        this.time_step.stop()
        this.backToLobby()
    }

    backToLobby() {
        this.input.keyboard?.on('keydown-ENTER', () => {
            this.scene.start('Lobby')
        })
    }
}
