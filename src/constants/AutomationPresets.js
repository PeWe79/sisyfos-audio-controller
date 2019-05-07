//While developing mixer specific settings will be in one file.
//At first release these will be in seperate files
//So it´s easy to add new equipment.

export const AutomationPresets = {

    sofie: {
        protocol: 'OSC',
        label: 'Sofie Automation',
        mode: "client",
        leadingZeros: true,
        initializeCommands: [
            {
                oscMessage: "/info",
                value: 0,
                type: "f"
            }
        ],
        fromAutomation: {
            CHANNEL_PGM_ON_OFF: '/ch/{value1}/mix/pgm',
            CHANNEL_PST_ON_OFF: '/ch/{value1}/mix/pst',
            CHANNEL_FADER_LEVEL: '/ch/{value1}/mix/faderlevel',
            CHANNEL_VISIBLE: '/ch/{value1}/visible',
            X_MIX: '/take',
            FADE_TO_BLACK: '/fadetoblack',
            SNAP_MIX: '/snap/{value1}',
            STATE_CHANNEL_PGM: '/state/ch/{value1}/mix/pgm',
            STATE_CHANNEL_PST: '/state/ch/{value1}/mix/pst',
            STATE_CHANNEL_FADER_LEVEL: '/state/ch/{value1}/mix/faderlevel',
        },
        toAutomation: {
            STATE_CHANNEL_PGM: '/state/ch/{value1}/mix/pgm',
            STATE_CHANNEL_PST: '/state/ch/{value1}/mix/pst',
            STATE_CHANNEL_FADER_LEVEL: '/state/ch/{value1}/mix/faderlevel',
        },
        fader: {
            min: 0,
            max: 1,
            zero: 0.75,
            step: 0.01,
            fadeTime: 40,
        },
        meter: {
            min: 0,
            max: 1,
            zero: 0.75,
            test: 0.6,
        },
    }
};


export const AutomationProtocolList = Object.getOwnPropertyNames(AutomationPresets).map((preset) => {
    return {
        value: preset,
        label: AutomationPresets[preset].label
    };
});
