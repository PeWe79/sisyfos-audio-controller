import React, { ChangeEvent } from 'react'
import ClassNames from 'classnames'

import '../assets/css/PagesSettings.css'
import { Store } from 'redux'
import { connect } from 'react-redux'
import {
    SettingsActionTypes,
} from '../../../shared/src/actions/settingsActions'
import { Fader } from '../../../shared/src/reducers/fadersReducer'
import Select from 'react-select'
import {
    SOCKET_GET_PAGES_LIST,
    SOCKET_SET_PAGES_LIST,
} from '../../../shared/src/constants/SOCKET_IO_DISPATCHERS'
import { CustomPages } from '../../../shared/src/reducers/settingsReducer'
import { getFaderLabel } from '../utils/labels'

//Set style for Select dropdown component:
const selectorColorStyles = {
    control: (styles: any) => ({
        ...styles,
        backgroundColor: '#676767',
        color: 'white',
        border: 0,
        width: 400,
    }),
    option: (styles: any) => {
        return {
            backgroundColor: '#AAAAAA',
            color: 'white',
        }
    },
    singleValue: (styles: any) => ({ ...styles, color: 'white' }),
}
interface PagesSettingsInjectProps {
    customPages: CustomPages[]
    fader: Fader[]
}

class PagesSettings extends React.PureComponent<
    PagesSettingsInjectProps & Store
> {
    pageList: { id: string, label: string; value: number }[]
    state = { id: '', pageIndex: 0, label: '' }

    constructor(props: any) {
        super(props)

        this.pageList = this.props.customPages.map(
            (page: CustomPages, index: number) => {
                return { id: page.id, label: page.label, value: index }
            }
        )
    }

    componentDidMount() {
        const { id, label } = this.props.customPages[0]
        this.setState({ id, label })
    }

    handleSelectPage(event: any) {
        this.setState({ pageIndex: event.value })
        const { id, label } = this.props.customPages[event.value]
        this.setState({ id, label })
        console.log('PAGE SELECTED', this.state.pageIndex)
    }

    handleAssignFader(fader: number, event: any) {
        if (event.target.checked === false) {
            console.log('Unbinding Fader')
            if (
                window.confirm(
                    'Unbind Fader from page ' +
                        String(fader + 1) +
                        ' from Page ' +
                        String(this.state.pageIndex + 1)
                )
            ) {
                let nextPages: CustomPages[] = [...this.props.customPages]
                nextPages[this.state.pageIndex].faders.splice(
                    this.props.customPages[this.state.pageIndex].faders.indexOf(
                        fader
                    ),
                    1
                )
                window.storeRedux.dispatch({ type: SettingsActionTypes.SET_PAGES_LIST, customPages: nextPages})
                window.socketIoClient.emit(SOCKET_SET_PAGES_LIST, nextPages)
            }
        } else {
            console.log('Binding Channel')
            if (
                window.confirm(
                    'Bind Fader ' +
                        String(fader + 1) +
                        ' to Page ' +
                        String(this.state.pageIndex + 1) +
                        '?'
                )
            ) {
                let nextPages: CustomPages[] = [...this.props.customPages]
                nextPages[this.state.pageIndex].faders.push(fader)
                nextPages[this.state.pageIndex].faders.sort((a, b) => {
                    return a - b
                })
                window.storeRedux.dispatch({ type: SettingsActionTypes.SET_PAGES_LIST, customPages: nextPages})
                window.socketIoClient.emit(SOCKET_SET_PAGES_LIST, nextPages)
            }
        }
    }

    handleProperty = (property: 'id' | 'label', event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ [property]: event.target.value })
        this.pageList[this.state.pageIndex][property] = event.target.value
        let nextPages: CustomPages[] = [...this.props.customPages]
        nextPages[this.state.pageIndex][property] = event.target.value

        window.storeRedux.dispatch({ type: SettingsActionTypes.SET_PAGES_LIST, customPages: nextPages})
        window.socketIoClient.emit(SOCKET_SET_PAGES_LIST, nextPages)
    }

    handleClearRouting() {
        if (window.confirm('REMOVE ALL FADER ASSIGNMENTS????')) {
            let nextPages: CustomPages[] = [...this.props.customPages]
            nextPages[this.state.pageIndex].faders = []
            window.storeRedux.dispatch({ type: SettingsActionTypes.SET_PAGES_LIST, customPages: nextPages})
            window.socketIoClient.emit(SOCKET_SET_PAGES_LIST, nextPages)
        }
    }

    handleClose = () => {
        window.socketIoClient.emit(SOCKET_GET_PAGES_LIST)
        window.storeRedux.dispatch({ type: SettingsActionTypes.TOGGLE_SHOW_PAGES_SETUP})
    }

    renderFaderList() {
        return (
            <div>
                {this.props.fader.map((fader: Fader, index: number) => {
                    return (
                        <div
                            key={index}
                            className={ClassNames('pages-settings-tick', {
                                checked: this.props.customPages[
                                    this.state.pageIndex
                                ].faders.includes(index),
                            })}
                        >
                            {' Fader ' + (index + 1) + ' - ' + getFaderLabel(index) + ' : '}
                            {}
                            <input
                                title='Assign Fader to Page'
                                type="checkbox"
                                checked={this.props.customPages[
                                    this.state.pageIndex
                                ].faders.includes(index)}
                                onChange={(event) =>
                                    this.handleAssignFader(index, event)
                                }
                            />

                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="pages-settings-body">
                <h2>CUSTOM PAGES</h2>
                <button className="close" onClick={() => this.handleClose()}>
                    X
                </button>
                <Select
                    styles={selectorColorStyles}
                    value={{
                        label:
                            this.props.customPages[this.state.pageIndex]
                                .label ||
                            'Page : ' + (this.state.pageIndex + 1),
                        value: this.state.pageIndex,
                    }}
                    onChange={(event: any) => this.handleSelectPage(event)}
                    options={this.pageList}
                />
                <label className="inputfield">
                    ID :
                    <input
                        name="label"
                        type="text"
                        value={this.state.id}
                        onChange={(event) => this.handleProperty('id', event)}
                    />
                </label>
                <br />
                <label className="inputfield">
                    LABEL :
                    <input
                        name="label"
                        type="text"
                        value={this.state.label}
                        onChange={(event) => this.handleProperty('label', event)}
                    />
                </label>
                <br />
                {this.renderFaderList()}
                <button
                    className="button"
                    onClick={() => this.handleClearRouting()}
                >
                    CLEAR ALL
                </button>
                <br />
            </div>
        )
    }
}

const mapStateToProps = (state: any, props: any): PagesSettingsInjectProps => {
    return {
        customPages: state.settings[0].customPages,
        fader: state.faders[0].fader,
    }
}

export default connect<any, PagesSettingsInjectProps>(mapStateToProps)(
    PagesSettings
) as any
