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
    past: _state.past
}

const getPublicState = (contest) => {
    switch (contest.state) {
    case _state.past:
    case _state.draft:
        return contest.state
    }
    const now = new Date()
    if (contest.endPresentation > now) {
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

const fmt = (contest) => {
    const json  = contest.toJSON ? contest.toJSON() : contest
    json.state = getPublicState(contest)
    if (json.i18n) {
        json.i18n.forEach(i18n => {
            json[i18n.attribute] = i18n.text
        })
        delete json.i18n
    }
    return json
}

module.exports = {
    state : _state,
    publicState: _publicState,

    getPublicState,
    stateIsValid,
    datesAreValid,
    check,
    fmt
}
