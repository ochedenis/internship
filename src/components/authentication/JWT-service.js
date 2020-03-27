require('dotenv').config();
const JWT = require('jsonwebtoken');
const Model = require('../Admin/models');

/*

*/
async function generateTokens(email) {
	const accessToken = generateAccessToken(email);
	const refreshToken = JWT.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: '20d' });

	await Model.Token.create({ token: refreshToken, email });

	return { accessToken, refreshToken };
}

/*

*/
async function checkRefreshToken(token) {
	const savedToken = await Model.Token.findOneAndDelete({ token }).exec();

	if (!savedToken) {
		return null;
	}

	return JWT.verify(token, process.env.REFRESH_TOKEN, (error, data) => {
    	if (error) {
    		return null;
    	}

    	return data.email;
    })
}

/*

*/
function logout(email) {
	return Model.Token.findOneAndDelete({ email }).exec();
}

/*

*/
function checkTokenAvailability(email) {
	return Model.Token.findOne({ email }).exec();
}

/*

*/
function authenticate(req, res, next) {
  const token = req.headers['access-token'];
  if (!token) {
  	return res.status(401).send('Access denied!');	
  }

  JWT.verify(token, process.env.ACCESS_TOKEN, (error, data) => {
    if (error) {
    	return res.status(403).send('Invalid token!')
    }

    next()
  });
}

/*

*/
function generateAccessToken(email) {
	return JWT.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '10m' })
}

module.exports = {
	generateTokens,
	checkTokenAvailability,
	checkRefreshToken,
	logout,
	authenticate,
};