import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import Toast from 'react-native-easy-toast'

import ContactSelect from '../../components/ContactSelect'
import ThreadsActions from '../../../Redux/ThreadsRedux'
import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import styles from './statics/styles'

class ThreadsEdit extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selected: {}
    }
  }

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons >
        <Item title='Update Thread' onPress={() => {
          params.updateThread()
        }} />
      </TextileHeaderButtons>
    )

    // TODO: don't love the visual hierarchy of the links currently, need to figure out
    //   (
    //   <TextileHeaderButtons>
    //     <Item title='Share' iconName='share' onPress={params.getPublicLink} />
    //   </TextileHeaderButtons>
    // )

    return {
      headerRight,
      headerLeft
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      getPublicLink: this._getPublicLink.bind(this),
      updateThread: this._updateThread.bind(this),
      updateEnabled: false
    })
  }

  _getPublicLink () {
    // Generate a link dialog
    this.props.invite(
      this.props.navigation.state.params.threadId,
      this.props.navigation.state.params.threadName
    )
  }

  _select (contact, included) {
    // Toggle the id's selected state in state
    if (included) return // if the user is already part of the thread
    const state = !this.state.selected[contact.id]
    this.setState({
      selected: {...this.state.selected, [contact.id]: state}
    })
  }

  _updateThread () {
    // grab the Pks from the user Ids
    const inviteePks = Object.keys(this.state.selected).filter((id) => this.state.selected[id] === true).map((id) => {
      const existing = this.props.contacts.find((ctc) => ctc.id === id)
      return existing.pk
    })

    if (inviteePks.length === 0) {
      this.refs.toast.show('Select a peer first.', 1500)
      return
    }

    this.refs.toast.show('Success! The peer list will not update until your invitees accept.', 2400)
    this.props.addInternalInvites(this.props.navigation.state.params.threadId, inviteePks)
    setTimeout(() => { this.props.navigation.dispatch(NavigationActions.back()) }, 2400)
  }

  render () {
    return (
      <View style={styles.container}>
        <ContactSelect
          getPublicLink={this._getPublicLink.bind(this)}
          contacts={this.props.contacts}
          select={this._select.bind(this)}
          selected={this.state.selected}
          threadId={this.props.navigation.state.params.threadId}
        />
        <Toast ref='toast' position='top' fadeInDuration={50} style={styles.toast} textStyle={styles.toastText} />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    contacts: state.contacts.contacts.sort((a, b) => a.username < b.username)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    addInternalInvites: (threadId: string, inviteePks: string[]) => { dispatch(ThreadsActions.addInternalInvitesRequest(threadId, inviteePks)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsEdit)
