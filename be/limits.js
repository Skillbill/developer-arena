module.exports = {
    image: {
        maxAllowedSize: 2 * 1024 * 1024,
        allowedTypes: [
            'image/jpeg',
            'image/png'
        ]
    },
    deliverable: {
        maxAllowedSize: 32 * 1024 * 1024,
        allowedTypes: [
            'application/gzip',
            'application/x-bzip2',
            'application/x-tar',
            'application/zip'
        ]
    },
    video: {
        acceptedRegex: 'https:\\/\\/(?:youtu\\.be\\/|(?:www\\.)?youtube\\.com\\/watch\\?v=)([0-9A-Za-z_-]{11})'
    }
}
