import { IMixerProtocol, emptyMixerMessage } from '../MixerProtocolPresets';

export const GenericMidi: IMixerProtocol = {
    protocol: 'MIDI',
    label: 'Generic Midi',
    mode: "client", //master (ignores mixers faderlevel, and use faderlevel as gain preset),
                    //client (use feedback from mixers fader level)
    leadingZeros: false,
    pingCommand: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
    pingTime: 0,
    initializeCommands: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
    channelTypes: [{
        channelTypeName: 'CH',
        channelTypeColor: '#2f2f2f',
        fromMixer: {
            CHANNEL_FADER_LEVEL: [{ mixerMessage: "39", value: 0, type: 'f', min: 0, max: 1, zero: 0.75}],        //PgmChange 0 - ignores this command
            CHANNEL_OUT_GAIN: [{ mixerMessage: "0", value: 0, type: 'f', min: 0, max: 1, zero: 0.75}],            //PgmChange 0 - ignores this command
            CHANNEL_VU: [{ mixerMessage: "0", value: 0, type: 'f', min: 0, max: 1, zero: 0.75}],                   //PgmChange 0 - ignores this command
            CHANNEL_NAME: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
            PFL: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
            AUX_SEND: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
        },
        toMixer: {
            CHANNEL_FADER_LEVEL: [{ mixerMessage: "39", value: 0, type: 'f', min: 0, max: 1, zero: 0.75}],
            CHANNEL_OUT_GAIN: [{ mixerMessage: "38", value: 0, type: 'f', min: 0, max: 1, zero: 0.75}],
            CHANNEL_NAME: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
            PFL_ON: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
            PFL_OFF: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
            AUX_SEND: [{ mixerMessage: 'none', value: 0, type: 'f', min: 0, max: 1.5, zero: 1}],
        },
    }],
    fader: {
        min: 0,
        max: 127,
        zero: 100,
        step: 1,
    },
    meter: {
        min: 0,
        max: 127,
        zero: 100,
        test: 80,
    },
}
