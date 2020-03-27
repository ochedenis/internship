const { Schema } = require('mongoose');
const connections = require('../../config/connection');

const Admin = connections.model('AdminModel', new Schema(
    {   
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'admins',
        versionKey: false,
    },
));

const Token = connections.model('TokenModel', new Schema(
    {   
        token: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: '20d' },
        },

    },
    {
        collection: 'tokens',
        versionKey: false,
    },
));

module.exports = {
    Admin,
    Token,
};
