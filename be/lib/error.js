const http = require('./lookups').http

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
        msg: 'uidMismatch'
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
    }
}