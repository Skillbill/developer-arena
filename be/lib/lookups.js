module.exports = {
  http: {
    ok: 200,
    created: 201,
    badRequest: 400,
    notFound: 404,
    preconditionFailed: 412,
    unsupportedType: 415,
    unprocessableEntity: 422,
    internalError: 500
  },
  contest: {
    state: {
      draft: 'DRAFT',
      active: 'ACTIVE',
      past: 'PAST',
    },
    publicState: {
      presentation: 'PRESENTATION',
      applying: 'APPLYING',
      voting: 'VOTING',
      closed: 'CLOSED',
      past: 'PAST'
    }
  }
};
