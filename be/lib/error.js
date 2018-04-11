const http = require('./http')

module.exports = {
    new: (err, args) => Object.assign({}, err, { args: args }),

    internal: {
        http: http.internalError,
        code: 1001,
        msg: 'internal_server_error'
    },
    contestNotFound: {
        http: http.notFound,
        code: 1002,
        msg: 'contest_not_found'
    },
    projectNotFound: {
        http: http.notFound,
        code: 1003,
        msg: 'project_not_found'
    },
    imageNotFound: {
        http: http.notFound,
        code: 1004,
        msg: 'image_not_found'
    },
    deliverableNotFound: {
        http: http.notFound,
        code: 1005,
        msg: 'deliverable_not_found'
    },
    contestNotOpenForSubmission: {
        http: http.preconditionFailed,
        code: 1006,
        msg: 'contest_not_open_for_submission'
    },
    contestNotOpenForVoting: {
        http: http.preconditionFailed,
        code: 1007,
        msg: 'contest_not_open_for_voting'
    },
    missingParameter: {
        http: http.badRequest,
        code: 1008,
        msg: 'missing_parameter'
    },
    alreadySubmittedProject: {
        http: http.preconditionFailed,
        code: 1009,
        msg: 'already_submitted_project'
    },
    alreadyVotedProject: {
        http: http.preconditionFailed,
        code: 1010,
        msg: 'already_voted_project'
    },
    uidMismatch: {
        http: http.unauthorized,
        code: 1011,
        msg: 'uid_mismatch'
    },
    fileTooBig: {
        http: http.unprocessableEntity,
        code: 1012,
        msg: 'file_too_big'
    },
    fileNoName: {
        http: http.unprocessableEntity,
        code: 1013,
        msg: 'file_no_name'
    },
    fileInvalidType: {
        http: http.unprocessableEntity,
        code: 1014,
        msg: 'file_invalid_type'
    },
    invalidParam: {
        http: http.unprocessableEntity,
        code: 1015,
        msg: 'invalid_param'
    },
    invalidState: {
        http: http.badRequest,
        code: 1016,
        msg: 'invalid_state'
    },
    invalidDates: {
        http: http.badRequest,
        code: 1017,
        msg: 'invalid_dates'
    },
    notAdmin: {
        http: http.unauthorized,
        code: 1101,
        msg: 'not_admin'
    },
    emailNotVerified: {
        http: http.unauthorized,
        code: 1201,
        msg: 'email_not_verified'
    },
    tokenMissing: {
        http: http.unauthorized,
        code: 1202,
        msg: 'token_missing'
    },
    tokenError: {
        http: http.badRequest,
        code: 1203,
        msg: 'token_error'
    },
    tokenExpired: {
        http: http.badRequest,
        code: 1204,
        msg: 'token_expired'
    }
}
