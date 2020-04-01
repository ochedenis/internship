const bcrypt = require('bcrypt');
const Model = require('./models');

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

/* search for admin at db by eamil */
function findOne(email) {
    return Model.Admin.findOne({ email }).exec();
}

/* search for admin at db by id */
async function findById(id) {
    const admin = await Model.Admin.findById(id).exec();
    return admin;
}

/* checks coming data, delete admin from db */
async function deleteByData(data) {
    const admin = await Model.Admin.findOne({ email: data.email }).exec();

    if (!admin) {
        return false;
    }
    if (! await bcrypt.compare(data.password, admin.password)) {
        return false;
    }

    await Model.Admin.deleteOne({ _id: admin._id }).exec();

    return true;
}

/* delete admin from db by email */
function deleteByEmail(email) {
    return Model.Admin.deleteOne({ email }).exec();
}

module.exports = {
    create,
    findOne,
    findById,
    deleteByData,
    deleteByEmail,
};
