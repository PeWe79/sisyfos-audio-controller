import * as React from 'react';
import { connect } from "react-redux";
import { IStore } from '../reducers/indexReducer';


import '../assets/css/App.css';
import Channels from './Channels';
import Settings from './Settings';
import Storage from './RoutingStorage'

//Utils:
import { MixerGenericConnection } from '../utils/MixerConnection';
import { HuiMidiRemoteConnection } from '../utils/HuiMidiRemoteConnection';

export interface IAppProps {
    store: IStore
}

class App extends React.Component<IAppProps> {

    constructor(props: IAppProps) {
        super(props)
    }

    componentWillMount() {
        (window as any).mixerGenericConnection = new MixerGenericConnection();
        if (this.props.store.settings[0].enableRemoteFader){
            (window as any).huiRemoteConnection = new HuiMidiRemoteConnection();
        }
        // ** UNCOMMENT TO DUMP A FULL STORE:
        // const fs = require('fs')
        // fs.writeFileSync('src/components/__tests__/__mocks__/parsedFullStore-UPDATE.json', JSON.stringify(window.storeRedux.getState()))
        let timer = setInterval(() => {
            window.ipcRenderer.send('get-store', 'update local store');
            window.ipcRenderer.send('get-settings', 'update local settings');
            window.ipcRenderer.send('get-mixerprotocol', 'get selected mixerprotocol')
        },
        1000)
    }

    public shouldComponentUpdate(nextProps: IAppProps) {
        return (
            nextProps.store.settings[0].showSettings != this.props.store.settings[0].showSettings
            || nextProps.store.settings[0].showStorage != this.props.store.settings[0].showStorage
        )
    }

    render() {
        return (
        <div>
            <Channels />
            {this.props.store.settings[0].showStorage ? <Storage/> : null}
            {this.props.store.settings[0].showSettings ? <Settings/> : null}
        </div>
        )
    }
}


const mapStateToProps = (state: any): IAppProps => {
    return {
        store: state
    }
}

export default connect<any, IAppProps>(mapStateToProps)(App) as any;
