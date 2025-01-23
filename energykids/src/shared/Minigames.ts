import { Minigame } from './entities/Minigame.ts'

export const Minigames: Minigame[] = [
    {
        sceneName: 'PushButtonGame',
        title: 'Step up - Energize your city',
        tutorialText: `A city needs positive energy to grow and thrive - help us stomp out energy to transform the city and make it better!`,
        character1: 'pb_kyo1_1',
        character2: 'pb_kyo2_1',
    },
    {
        sceneName: 'CatchGame',
        title: 'Catch something',
        tutorialText: `Litter everywhere! Use your arrow keys to catch the litter as quickly as possible!`,
        character1: 'pb_kyo1_1', // TODO: Change to the CatchGame character
        character2: 'pb_kyo2_1', // TODO: Change to the CatchGame character
    },
]
