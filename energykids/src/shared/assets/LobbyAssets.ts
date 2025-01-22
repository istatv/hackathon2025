import LoaderPlugin = Phaser.Loader.LoaderPlugin

export const loadLobbyAssets = (load: LoaderPlugin) => {
    /** Lobby Scene */
    load.image([
        { key: 'city_background1', url: 'city/Background_worstcase_0.png' },
        { key: 'city_background2', url: 'city/Background_ok_33.png' },
        { key: 'city_background3', url: 'city/Background_good_66.png' },
        {
            key: 'city_background4',
            url: 'city/Background_bestcase_100.png',
        },
    ])
    load.svg([
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
