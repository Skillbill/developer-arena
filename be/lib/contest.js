const error = require('@/lib/error')

const _state = {
    draft: 'DRAFT',
    active: 'ACTIVE',
    past: 'PAST',
}

const _publicState = {
    presentation: 'PRESENTATION',
    applying: 'APPLYING',
    voting: 'VOTING',
    closed: 'CLOSED',
    past: 'PAST'
}

const getPublicState = (contest) => {
    const now = new Date()
    if (contest.state == _state.past) {
        return contest.publicState.past
    } else if (contest.endPresentation > now) {
        return _publicState.presentation
    } else if (contest.endApplying > now) {
        return _publicState.applying
    } else if (contest.endVoting > now) {
        return _publicState.voting
    } else {
        return _publicState.closed
    }
}

const stateIsValid = (contest) => Object.values(_state).includes(contest.state)

const datesAreValid = (contest) => {
    const dates = ['endPresentation', 'endApplying', 'endVoting'].map(k => new Date(contest[k]))
    for (let i=0; i<dates.length-1; i++) {
        if (dates[i] > dates[i+1]) {
            return false
        }
    }
    return true
}

const check = (contest) => {
    if (!stateIsValid(contest)) {
        return error.invalidState
    }
    if (!datesAreValid(contest)) {
        return error.new(error.invalidDates, {state: contest.state})
    }
    if (!contest.i18n || !(contest.i18n instanceof Array) || contest.i18n.length == 0) {
        return error.new(error.missingParameter, {parameter: 'i18n'})
    }
    return null
}

module.exports = {
    state : _state,
    publicState: _publicState,

    getPublicState,
    stateIsValid,
    datesAreValid,
    check
}
