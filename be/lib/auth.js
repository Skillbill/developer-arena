const http = require('./http')
const logger = require('./logger')
const firebase = require('firebase-admin')

let fakeAuthEnabled = false

const firebase_auth_mw = (req, res, next) => {
    const token = extractToken(req)
    if (!token) {
        return res.status(http.unauthorized).send({error: 'unauthorized'})
    }
    firebase.auth().verifyIdToken(token).then(decodedToken => {
        req.user = {
            uid: decodedToken.uid,
            provider: decodedToken.firebase.sign_in_provider,
            email: decodedToken.email
        }
        if (req.user.provider == 'password' && !decodedToken.email_verified) {
            return res.status(http.unauthorized).send({error: 'email not verified'})
        }
        next()
    }).catch(err => {
        logger.error(`cannot decode token: ${err.message}}`)
        res.status(http.badRequest).send({error: `wrong token: ${err.message}`})
    })
}

const fake_auth_mw = (req, res, next) => {
    const uid = req.get('Authorization')
    if (!uid) {
        return res.status(http.unauthorized).send({error: 'missing authorization header'})
    }
    req.user = {
        uid: uid
    }
    next()
}

const middleware = (req, res, next) => (fakeAuthEnabled ? fake_auth_mw : firebase_auth_mw)(req, res, next)

const init = (cfg) => {
    if (cfg.devMode) {
        logger.warn('firebase is DISABLED: using fake auth middleware instead (dev mode)')
        fakeAuthEnabled = true
        return
    }
    try {
        logger.info(`svc account project: ${cfg.serviceAccount.project_id}`)
        logger.info(`svc account private: ${cfg.serviceAccount.private_key_id}`)
        firebase.initializeApp({
            credential: firebase.credential.cert(cfg.serviceAccount),
            databaseURL: cfg.databaseURL
        })
    } catch (err) {
        logger.error('could not initialize firebase:', JSON.stringify(err))
        throw 'failed to initialize auth lib'
    }
}

const extractToken = (req) => {
    const header = req.get('Authorization')
    const pfx = 'Bearer '
    if (header && header.startsWith(pfx)) {
        return header.substr(pfx.length)
    }
}

module.exports = {
    init: init,
    middleware: middleware
}
