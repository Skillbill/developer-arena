
module.exports = {
  http: {
    ok: 200,
    badRequest: 400,
    notFound: 404,
    internalError: 500,
  },
  contestStates: {
    draft: 'DRAFT',
    presentation: 'PRESENTATION',
    applying: 'APPLYING',
    voting: 'VOTING',
    closed: 'CLOSED',
    past: 'PAST'
  }
};
