const http = require('./http')
const logger = require('./logger')
const config = require('./config').get()
const firebase = require('firebase-admin')

let fakeAuthEnabled = false
const isAdmin = (uid) => config.admins ? config.admins.includes(uid) : false

const extractToken = (req) => {
    const header = req.get('Authorization')
    const pfx = 'Bearer' + ' '
    if (header && header.startsWith(pfx)) {
        return header.substr(pfx.length)
    }
}
const get_firebase_user = (req) => {
    const token = extractToken(req)
    if (!token) {
        return Promise.reject(null)
    }
    return new Promise((resolve, reject) => {
        firebase.auth().verifyIdToken(token).then(decodedToken => {
            resolve({
                uid: decodedToken.uid,
                provider: decodedToken.firebase.sign_in_provider,
                email: decodedToken.email,
                isAdmin: isAdmin(decodedToken.uid),
                emailVerified: decodedToken.email_verified
            })
        }).catch(err => {
            logger.error(`cannot decode token: ${err.message}}`)
            reject(err)
        })
    })
}

const firebase_auth = (req, res, next) => {
    get_firebase_user(req).then(user => {
        if (user.provider == 'password' && !user.email_verified) {
            return res.status(http.unauthorized).send({error: 'email not verified'})
        }
        req.user = user
        next()
    }).catch(err => {
        res.status(http.badRequest).send({error: err ? err : 'no token provided'})
    })
}

const firebase_auth_optional = (req, res, next) => {
    get_firebase_user(req).then(user => {
        req.user = user
        next()
    }).catch(err => {
        if (err == null) { // no token provided, not a big deal
            return next()
        }
        res.status(http.badRequest).send({error: `wrong token: ${err.message}`})
    })
}

const get_fake_user = (req) => {
    const uid = req.get('Authorization')
    if (!uid) {
        return null
    }
    return {
        uid: uid.slice(0, 32),
        isAdmin: isAdmin(uid)
    }
}

const fake_auth = (req, res, next) => {
    const user = get_fake_user(req)
    if (!user) {
        return res.status(http.unauthorized).send({error: 'missing authorization header'})
    }
    req.user = user
    next()
}

const fake_auth_optional = (req, res, next) => {
    const user = get_fake_user(req)
    if (user) {
        req.user = user
    }
    next()
}

const middleware = (req, res, next) => (fakeAuthEnabled ? fake_auth : firebase_auth)(req, res, next)
const middleware_optional = (req, res, next) => (fakeAuthEnabled ? fake_auth_optional : firebase_auth_optional)(req, res, next)

const init = () => {
    const cfg = config.firebase
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

module.exports = {
    init: init,
    middleware: middleware,
    middleware_optional: middleware_optional
}
