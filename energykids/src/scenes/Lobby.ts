import { Scene } from 'phaser'
import { EnergykidsGamecontrol } from '../shared/EnergykidsGamecontrol.ts'
import { Player } from '../shared/entities/Player.ts'
import { Minigame } from '../shared/entities/Minigame.ts'
import { Minigames } from '../shared/Minigames.ts'
import Point = Phaser.Geom.Point

export class Lobby extends Scene {
    background: Phaser.GameObjects.Image
    gameState: EnergykidsGamecontrol

    constructor() {
        super('Lobby')
        this.gameState = EnergykidsGamecontrol.getInstance()
    }

    create() {
        this.renderCityAndScore()
        this.renderPlayerScores()
        this.renderButtons()
        this.cameras.main.fadeIn(500, 255, 255, 255)
    }

    renderButtons() {
        const buttonPosition = new Point(150, 240)
        // Start game
        const startButton = this.add
            .image(buttonPosition.x, buttonPosition.y, 'button_start')
            .setInteractive()
            .on('pointerover', () => {
                startButton.setTexture('button_start_hover')
            })
            .on('pointerout', () => {
                startButton.setTexture('button_start')
            })
            .on('pointerdown', () => {
                this.launchMiniGame(
                    Minigames[Phaser.Math.Between(0, Minigames.length - 1)]
                )
            })

        this.add
            .text(buttonPosition.x, buttonPosition.y, 'Start Game', {
                fontSize: '32px',
                color: '#0165E4',
                fontFamily: 'MightySoul',
            })
            .setOrigin(0.5)

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
                this.cameras.main.fadeOut(1000, 255, 255, 255)
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    (cam, effect) => {
                        this.gameState.reset()
                        this.scene.stop()
                        this.scene.start('Lobby')
                    }
                )
            })

        this.add
            .text(950, 50, 'Restart', {
                fontSize: '21px',
                color: '#0165E4',
                fontFamily: 'MightySoul',
            })
            .setOrigin(0.45, 0.85)
    }

    renderPlayerScores() {
        this.add.image(900, 665, 'lobby_score')
        this.renderPlayerNameAndScore(
            new Point(870, 615),
            this.gameState.getPlayerAt(0)
        )

        this.renderPlayerNameAndScore(
            new Point(982, 615),
            this.gameState.getPlayerAt(1)
        )
    }

    renderCityAndScore() {
        const score = this.gameState.getTotalScore()
        const scoreGoal = this.gameState.getTotalScoreGoal()
        const percentage = score > 0 ? Math.floor((score / scoreGoal) * 100) : 0
        const cityOrigin = new Point(-0.1, 0)

        const backgroundPosition = new Point(512, 384)
        const scorePosition = new Point(100, 680)

        let number = 1 // Default == bad

        if (percentage >= 33) {
            number = 2
        }
        if (percentage >= 66) {
            number = 3
        }
        if (percentage >= 100) {
            number = 4
        }

        this.add.image(
            backgroundPosition.x,
            backgroundPosition.y,
            'city_background' + number
        )
        this.add.text(50, 50, 'Save the city - \nBe the hero', {
            fontFamily: 'MightySoul',
            fontSize: '50px',
            color: '#ABCFFB',
        })
        this.sound.stopAll()
        this.sound.play('caketown')

        this.add.image(scorePosition.x, scorePosition.y, 'life' + number)
        const city = this.add
            .image(0, 0, 'city' + number)
            .setOrigin(cityOrigin.x, cityOrigin.y)
        this.tweens.add({
            targets: city,
            y: city.y - 20,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            duration: 3000,
        })

        // Total score
        this.add
            .text(
                scorePosition.x,
                scorePosition.y,
                this.gameState.getTotalScore().toString(),
                {
                    fixedWidth: 150,
                    align: 'center',
                    fontSize: '24px',
                    color: '#0165E4',
                    fontFamily: 'MightySoul',
                }
            )
            .setOrigin(0.255, 0.5)
    }

    updatePlayerName(player: Player) {
        // Create a background overlay
        const overlay = this.add.rectangle(512, 400, 400, 400, 0x000000, 0.7)
        overlay.setInteractive()

        // Add a container for the popup
        const popup = this.add.rectangle(512, 400, 300, 300, 0xffffff)
        popup.setStrokeStyle(2, 0x0000ff)

        const text = this.add
            .text(512, 300, 'Enter Player Name:', {
                fontSize: '24px',
                color: '#000',
                fontFamily: 'MightySoul',
            })
            .setOrigin(0.5)

        // Create an HTML input element
        const inputElement = document.createElement('input')
        inputElement.type = 'text'
        inputElement.style.position = 'absolute'
        inputElement.style.top = '50%'
        inputElement.style.left = '50%'
        inputElement.style.transform = 'translate(-50%, -50%)'
        inputElement.style.width = '200px'
        inputElement.style.height = '30px'
        inputElement.style.fontSize = '18px'
        document.body.appendChild(inputElement)

        // Add a confirm button
        const confirmButton = this.add
            .text(512, 500, 'Confirm', {
                fontSize: '24px',
                color: '#ffffff',
                backgroundColor: '#0000ff',
                padding: { x: 10, y: 5 },
                fontFamily: 'MightySoul',
            })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                const userName = inputElement.value
                if (userName.trim().length > 0) {
                    player.name = userName
                    this.renderPlayerScores()
                }

                // Cleanup popup elements
                overlay.destroy()
                popup.destroy()
                text.destroy()
                confirmButton.destroy()
                document.body.removeChild(inputElement)
            })
    }

    launchMiniGame(game: Minigame) {
        // Add data to the registry
        this.registry.set('sceneConfig', {
            title: game.title,
            tutorialText: game.tutorialText,
            sceneToStart: game.sceneName,
            character1: game.character1,
            character2: game.character2,
        })

        this.cameras.main.fadeOut(800, 255, 255, 255)
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            (cam, effect) => {
                this.scene.stop()
                this.scene.start('MinigameIntro')
            }
        )
    }

    renderPlayerNameAndScore(startPoint: Point, player: Player) {
        this.add
            .text(startPoint.x, startPoint.y, player.getScore().toString(), {
                fontFamily: 'MightySoul',
                color: '#ffffff',
                fixedWidth: 30,
                align: 'center',
            })
            .setOrigin(0.5, 0.5)
        this.add.text(startPoint.x - 67, startPoint.y + 80, player.name, {
            color: '#0165E4',
            fontFamily: 'MightySoul',
            fixedWidth: 68,
            fontSize: '15px',
            align: 'center',
        }) // Name
        this.add
            .rectangle(
                startPoint.x - 35,
                startPoint.y + 46,
                80,
                100,
                0x000000,
                0
            )
            .setInteractive()
            .on('pointerdown', () => {
                this.updatePlayerName(player)
            })
    }
}
