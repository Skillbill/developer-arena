const http = require('@/lib/http')
const logger = require('@/lib/logger')

const errors = {
    internal: {
        http: http.internalError,
        code: 5001,
        msg: 'internal_server_error'
    },
    contestNotFound: {
        http: http.notFound,
        code: 4401,
        msg: 'contest_not_found'
    },
    projectNotFound: {
        http: http.notFound,
        code: 4402,
        msg: 'project_not_found'
    },
    imageNotFound: {
        http: http.notFound,
        code: 4403,
        msg: 'image_not_found'
    },
    deliverableNotFound: {
        http: http.notFound,
        code: 4404,
        msg: 'deliverable_not_found'
    },
    userNotFound: {
        http: http.notFound,
        code: 4405,
        msg: 'user_not_found'
    },
    contestNotOpenForSubmission: {
        http: http.preconditionFailed,
        code: 4301,
        msg: 'contest_not_open_for_submission'
    },
    contestNotOpenForVoting: {
        http: http.preconditionFailed,
        code: 4302,
        msg: 'contest_not_open_for_voting'
    },
    missingParameter: {
        http: http.badRequest,
        code: 4001,
        msg: 'missing_parameter'
    },
    alreadySubmittedProject: {
        http: http.preconditionFailed,
        code: 4303,
        msg: 'already_submitted_project'
    },
    alreadyVotedProject: {
        http: http.preconditionFailed,
        code: 4304,
        msg: 'already_voted_project'
    },
    uidMismatch: {
        http: http.unauthorized,
        code: 4101,
        msg: 'uid_mismatch'
    },
    fileTooBig: {
        http: http.tooLarge,
        code: 4201,
        msg: 'file_too_big'
    },
    fileNoName: {
        http: http.badRequest,
        code: 4202,
        msg: 'file_no_name'
    },
    fileInvalidType: {
        http: http.unsupportedType,
        code: 4203,
        msg: 'file_invalid_type'
    },
    invalidUrl: {
        http: http.badRequest,
        code: 4204,
        msg: 'invalid_url'
    },
    invalidState: {
        http: http.badRequest,
        code: 4305,
        msg: 'invalid_state'
    },
    invalidDates: {
        http: http.badRequest,
        code: 4306,
        msg: 'invalid_dates'
    },
    notAdmin: {
        http: http.forbidden,
        code: 4102,
        msg: 'not_admin'
    },
    emailNotVerified: {
        http: http.forbidden,
        code: 4103,
        msg: 'email_not_verified'
    },
    tokenMissing: {
        http: http.unauthorized,
        code: 4104,
        msg: 'token_missing'
    },
    tokenError: {
        http: http.badRequest,
        code: 4105,
        msg: 'token_error'
    },
    tokenExpired: {
        http: http.badRequest,
        code: 4106,
        msg: 'token_expired'
    },
    previewFailed: {
        http: http.unprocessableEntity,
        code: 4204,
        msg: 'preview_failed'
    }
}

// validate error codes
Object.values(errors).map(e => e.code).forEach((code, i, lst) => {
    if (lst.indexOf(code) != i) {
        logger.warn(`found duplicated error code ${code}`)
    }
})

module.exports = Object.assign(errors, {
    new: (err, args) => Object.assign({}, err, { args: args }),
})
