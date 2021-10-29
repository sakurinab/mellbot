const mongoose = require('mongoose');
const config = require('../botconfig.json');

const rolesSchema = new mongoose.Schema({
	userID: {type: String, required: true, unique: true},
	roleID: {type: String},
	Role: {type: String}
});

const model = mongoose.model("RolesSchema", rolesSchema);

module.exports = model;