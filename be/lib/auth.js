const logger = require('@/lib/logger')
const error = require('@/lib/error')
const firebase = require('firebase-admin')

let _config = {}
let fakeAuthEnabled = false
const isAdmin = (uid) => _config.admins ? _config.admins.includes(uid) : false

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
        return Promise.reject(error.tokenMissing)
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
            // if the token has expired, err.code is "auth/argument-error" but in the
            // message string you can find the correct one: "auth/id-token-expired".
            // TODO: contact firebase-admin mantainers?
            if (err.message.includes('auth/id-token-expired')) {
                reject(error.tokenExpired)
            } else {
                reject(error.tokenError)
            }
        })
    })
}

const firebase_auth = (req, res, next) => {
    get_firebase_user(req).then(user => {
        if (user.provider == 'password' && !user.email_verified) {
            return next(error.emailNotVerified)
        }
        req.user = user
        next()
    }).catch(err => {
        next(err)
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
        return next(error.tokenMissing)
    }
    req.user = user
    next()
}

const middleware = (req, res, next) => (fakeAuthEnabled ? fake_auth : firebase_auth)(req, res, next)

const init = (config) => {
    _config = Object.assign({}, config)
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
    middleware: middleware
}
