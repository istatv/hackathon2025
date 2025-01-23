import { Scene } from 'phaser'
import { EnergykidsGamecontrol } from '../shared/EnergykidsGamecontrol.ts'
import Text = Phaser.GameObjects.Text
import Point = Phaser.Geom.Point

interface Player {
    title: Text
    subtitle: Text
    position: Point
    diameter: number
    button: string
    ready: boolean
}

export class MinigameIntro extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera
    background: Phaser.GameObjects.Image

    // Retrieve data from the registry
    config: any

    players: Player[] = []

    gameTitle: Phaser.GameObjects.Text
    gameDescription: Phaser.GameObjects.Text

    constructor() {
        super('MinigameIntro')
    }

    setupScene() {
        this.sound.stopAll()
        this.sound.play('countdown')

        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x00ffea)

        this.background = this.add.image(512, 384, 'pb_background')

        // Add Game Title
        this.add.text(50, 50, 'Save the city - \nBe the hero', {
            fontFamily: 'MightySoul',
            fontSize: '50px',
            color: '#ABCFFB',
        })

        // Add MiniGame Title
        this.gameTitle = this.add.text(0, 150, this.config.title, {
            align: 'center',
            fixedWidth: 1024,
            fontSize: '48px',
            color: '#00F077',
            fontFamily: 'MightySoul',
        })

        // Add Description
        this.gameDescription = this.add.text(
            100,
            +this.game.config.height / 2 - 150,
            this.config.tutorialText,
            {
                align: 'center',
                padding: {
                    left: 80,
                    right: 80,
                },
                wordWrap: {
                    width: 700,
                    useAdvancedWrap: false,
                },
                fontSize: '32px',
                color: '#ABCFFB',
                fontFamily: 'MightySoul',
            }
        )

        this.cameras.main.fadeIn(500, 255, 255, 255)
    }

    renderPlayers() {
        const gameControl = EnergykidsGamecontrol.getInstance()
        const playerAmount = gameControl.getPlayers().length
        const division = +this.game.config.width / (playerAmount + 1)
        this.players = []

        for (let i = 0; i < playerAmount; i++) {
            const position = new Point(
                Math.floor(division * (i + 1)),
                +this.game.config.height - 180
            )
            const diameter = 100
            const button = i === 0 ? 'R' : 'SPACE'

            const title = this.add.text(
                position.x - diameter - 50,
                position.y - 20,
                gameControl.getPlayerAt(i).name,
                {
                    align: 'center',
                    fixedWidth: 300,
                    fontSize: '32px',
                    color: '#ABCFFB',
                    fontFamily: 'MightySoul',
                }
            )

            const subtitle = this.add.text(
                position.x - 70,
                position.y + 20,
                'Press ' + button + " when you're ready",
                {
                    align: 'center',
                    fontSize: '24px',
                    color: '#ABCFFB',
                    fontFamily: 'MightySoul',
                    wordWrap: {
                        width: 310,
                        useAdvancedWrap: false,
                    },
                }
            )

            const characterKey = `character${i + 1}`
            this.add.image(
                position.x,
                position.y - 100,
                this.config[characterKey]
            )

            const player: Player = {
                button,
                position,
                diameter,
                title,
                subtitle,
                ready: false,
            }

            this.players.push(player)
        }
    }

    waitUntilReady() {
        const gameControl = EnergykidsGamecontrol.getInstance()
        const playerAmount = gameControl.getPlayers().length
        for (let i = 0; i < playerAmount; i++) {
            this.input.keyboard?.on('keydown-' + this.players[i].button, () => {
                this.players[i].subtitle.setText('Ready!')
                this.players[i].ready = true
                if (this.players.reduce((p, c) => c.ready && p, true)) {
                    this.time.delayedCall(500, () => {
                        this.add.text(
                            0,
                            +this.game.config.height / 2 - 100,
                            'Get Ready!',
                            {
                                align: 'center',
                                fixedWidth: 1024,
                                fontSize: 70,
                                color: '#00F077',
                                fontStyle: 'bold',
                                fontFamily: 'MightySoul',
                            }
                        )
                        this.gameTitle.setVisible(false)
                        this.gameDescription.setVisible(false)
                        this.time.delayedCall(2000, () => {
                            this.cameras.main.fadeOut(1000, 0, 0, 0)
                            this.cameras.main.once(
                                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                                (cam, effect) => {
                                    this.scene.stop()
                                    this.scene.start(this.config.sceneToStart)
                                }
                            )
                        })
                    })
                }
            })
        }
    }

    renderButtons() {
        const restartButton = this.add
            .image(950, 50, 'button_exit')
            .setInteractive()
            .on('pointerover', () => {
                restartButton.setTexture('button_exit_hover')
            })
            .on('pointerout', () => {
                restartButton.setTexture('button_exit')
            })
            .on('pointerdown', () => {
                this.scene.start('Lobby')
            })
        this.add
            .text(950, 50, 'Exit', {
                fontSize: '21px',
                color: '#0165E4',
                fontFamily: 'MightySoul',
            })
            .setOrigin(0.45, 1)
    }

    create() {
        this.config = this.registry.get('sceneConfig')
        this.setupScene()
        this.renderPlayers()
        this.waitUntilReady()
        this.renderButtons()
    }
}
