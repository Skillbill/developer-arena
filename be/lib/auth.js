const logger = require('@/lib/logger')
const error = require('@/lib/error')
const firebase = require('firebase-admin')

let _config = {}
let fakeAuthEnabled = false

const adminPolicies = {
    uid: (user) => _config.admin.enabled.includes(user.uid),
    email: (user) => user.emailVerified && _config.admin.enabled.includes(user.email),
    domain: (user) => user.emailVerified && _config.admin.enabled.includes(user.email.split('@')[1])
}

const defaultAdminPolicy = 'uid'
let isAdmin = adminPolicies[defaultAdminPolicy]

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
            let email = decodedToken.email
            if (decodedToken.customClaims && decodedToken.customClaims.email) {
                email = decodedToken.customClaims.email
            }
            let user = {
                uid: decodedToken.uid,
                provider: decodedToken.firebase.sign_in_provider,
                email: email,
                emailVerified: decodedToken.email_verified
            }
            user.isAdmin = isAdmin(user)
            resolve(user)
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
        if (user.provider == 'password' && !user.emailVerified) {
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
        isAdmin: isAdmin({uid})
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

const init = (config) => {
    _config = Object.assign({}, config)
    const cfg = config.auth
    if (cfg.devMode) {
        logger.warn('firebase is DISABLED: using fake auth middleware instead (dev mode)')
        fakeAuthEnabled = true
        isAdmin = adminPolicies.uid
        if (_config.admin.policy && _config.admin.policy != 'uid') {
            logger.warn(`admin policy in dev mode is forced to 'uid'. "${_config.admin.policy}" ignored`)
        }
        return
    }
    try {
        logger.info(`svc account project: ${cfg.firebase.serviceAccount.project_id}`)
        logger.info(`svc account private: ${cfg.firebase.serviceAccount.private_key_id}`)
        firebase.initializeApp({
            credential: firebase.credential.cert(cfg.firebase.serviceAccount)
        })
        if (_config.admin.policy) {
            isAdmin = adminPolicies[_config.admin.policy]
            if (!isAdmin) {
                logger.warn(`admin policy "${_config.admin.policy}" is not supported: using ${defaultAdminPolicy}`)
                isAdmin = adminPolicies[defaultAdminPolicy]
            }
        }
    } catch (err) {
        logger.error('could not initialize firebase:', err.message)
        throw 'failed to initialize auth lib'
    }
}

const getUserById = (id) => new Promise((resolve, reject) => {
    if (fakeAuthEnabled) {
        return resolve({uid: id})
    }
    firebase.auth().getUser(id).then(user => resolve(user))
        .catch(err => {
            if (err.code == 'auth/user-not-found') {
                return resolve()
            }
            reject(err)
        })
})

const setUserEmail = (uid, email) => {
    if (fakeAuthEnabled) {
        return Promise.resolve()
    }
    return firebase.auth().setCustomUserClaims(uid, {email: email})
}

const middleware = (req, res, next) => (fakeAuthEnabled ? fake_auth : firebase_auth)(req, res, next)

module.exports = {
    init,
    getUserById,
    setUserEmail,
    middleware
}
