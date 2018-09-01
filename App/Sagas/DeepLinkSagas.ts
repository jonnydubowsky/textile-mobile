/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import UIActions from '../Redux/UIRedux'
import { ActionType } from 'typesafe-actions'
import DeepLink from '../Services/DeepLink'
import NavigationService from '../Services/NavigationService'
import {PreferencesSelectors} from '../Redux/PreferencesRedux'
import AuthActions, {AuthSelectors} from '../Redux/AuthRedux'


export function * inviteAfterOnboard () {
  const invite = yield select(AuthSelectors.invite)
  if (invite) {
    // ensures this is the last of the knock-on effects of onboarding
    yield call(delay, 250)
    NavigationService.navigate('ThreadInvite', { url: invite.url, request: DeepLink.getParams(invite.hash) })
  }
}

export function * routeThreadInvite(url: string, hash: string ) {
  const onboarded = yield select(PreferencesSelectors.onboarded)
  console.log('axh', url, hash, onboarded)
  if (onboarded) {
    // invite the user to the thread
    NavigationService.navigate('ThreadInvite', { url, request: DeepLink.getParams(hash) })
  } else {
    // simply store the pending invite information to act on after onboarding success
    const data = DeepLink.getParams(hash)
    const referral: string = data.referral as string
    if (referral) {
      yield put(AuthActions.onboardWithInviteRequest(url, hash, referral))
    }
  }
}

export function * routeDeepLink (action: ActionType<typeof UIActions.routeDeepLinkRequest>) {
  const { url } = action.payload
  if (!url) return
  try {
    const data = DeepLink.getData(url)
    if (data) {
      if (data.path === '/invites/device' && data.hash !== '') {
        // start pairing the new device
        NavigationService.navigate('PairingView', { request: DeepLink.getParams(data.hash) })
      } else if (data.path === '/invites/new' && data.hash !== '') {
        yield call(routeThreadInvite, url, data.hash)
      }
    }
  } catch (error) {
    console.log('deeplink error', error)
  }
}
