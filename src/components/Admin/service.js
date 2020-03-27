const Model = require('./models');
const bcrypt = require('bcrypt');

/**
 * @exports
 * @method create
 * @param {object} data
 * @summary create a new admin
 * @returns {Promise<AdminModel>}
 */
async function create(data) {
	const password = await bcrypt.hash(data.password, 8);

    return Model.Admin.create({
    	name: data.name,
    	email: data.email,
    	password,
    });
}

/**

*/
function findOne(email) {
    return Model.Admin.findOne({ email }).exec();;
}

/*

*/
async function findById(id) {
    return await Model.Admin.findById(id).exec();
}

module.exports = {
    create,
    findOne,
    findById,
};