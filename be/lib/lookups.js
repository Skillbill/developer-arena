module.exports = {
  http: {
    ok: 200,
    badRequest: 400,
    notFound: 404,
    internalError: 500,
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
