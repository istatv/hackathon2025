import { GameObjects, Scene } from 'phaser'

export class MainMenu extends Scene {
    background: Phaser.GameObjects.Image
    logo: GameObjects.Image
    title: GameObjects.Text
    description: GameObjects.Text
    buttonText: GameObjects.Text

    constructor() {
        super('MainMenu')
    }

    create() {
        this.background = this.add.image(512, 384, 'background_startscreen')

        //this.logo = this.add.image(512, 300, 'logo')

        this.title = this.add
            .text(512, 280, 'Save the city -\n Be the hero', {
                align: 'center',
                fontSize: 80,
                color: '#00F077',
                fontStyle: 'bold',
                fontFamily: 'MightySoul',
            })
            .setOrigin(0.5)

        this.description = this.add
            .text(
                512,
                440,
                'The city is doing badly. Help us save her!\n Play little mini-games with us and watch the city \n gradualy improve. ',
                {
                    align: 'center',
                    fontSize: 30,
                    color: '#ABCFFB',
                    fontStyle: 'bold',
                    fontFamily: 'MightySoul',
                }
            )
            .setOrigin(0.5)

        const startButton = this.add
            .image(512, 600, 'button_start')
            .setInteractive()
            .on('pointerover', () => {
                startButton.setTexture('button_start_hover')
            })
            .on('pointerout', () => {
                startButton.setTexture('button_start')
            })
            .on('pointerdown', () => {
                this.scene.start('Lobby')
            })

        this.buttonText = this.add
            .text(512, 595, 'Let´s go!', {
                align: 'center',
                fontSize: 40,
                color: '#0165E4',
                fontStyle: 'bold',
                fontFamily: 'MightySoul',
            })
            .setOrigin(0.5)
    }
}
