let config

const defaults = {
    i18n: {
        locales: ['en', 'it'],
        defaultLocale: 'en'
    },
    db: {
        host: 'localhost',
        port: 5432,
        database: 'sda-contest',
        user: 'postgres',
        password: '1234'
    }
}

const db_env_map = {
    'host':     'DB_HOST',
    'port':     'DB_PORT',
    'database': 'DB_NAME',
    'user':     'DB_USER',
    'password': 'DB_PASSWD'
}

const init_from_env = (defs, map) => {
    let cfg = {}
    Object.keys(defs).forEach(k => {
        const v = process.env[map[k]]
        cfg[k] = (v === undefined ) ? defs[k] : v
    })
    return cfg
}

module.exports = {
    init : () => {
        config = defaults
        config.db = init_from_env(defaults.db, db_env_map)
        return Promise.resolve(config)
    },
    get : () => {
        if (!config) {
            throw {'error': 'config not initialized'}
        } else {
            return config
        }
    }
}
