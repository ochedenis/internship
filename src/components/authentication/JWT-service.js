require('dotenv').config();
const JWT = require('jsonwebtoken');
const Model = require('../Admin/models');

/* generate access token... */
function generateAccessToken(email) {
	return JWT.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '10m' });
}

/*
* generate access and refresh tokens
*/
async function generateTokens(email) {
	const accessToken = generateAccessToken(email);
	const refreshToken = JWT.sign({ email }, process.env.REFRESH_TOKEN, { expiresIn: '20d' });

	await Model.Token.create({ token: refreshToken, email });

	return { accessToken, refreshToken };
}

/* check identity of refresh token - delete token from db */
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

/* delete refresh token from db */
function logout(email) {
	return Model.Token.findOneAndDelete({ email }).exec();
}

/* check identity of refresh token */
function checkTokenAvailability(email) {
	return Model.Token.findOne({ email }).exec();
}

/* 
* jwt routes protection
* check availability of access token in request header
*/
function authenticate(req, res, next) {
  const token = req.headers['access-token'];
  if (!token) {
  	res.status(401).send('Access denied!');	
  }

  JWT.verify(token, process.env.ACCESS_TOKEN, (error, data) => {
    if (error) {
    	return res.status(403).send('Invalid token!');
    }

    return next();
  });
}

module.exports = {
	generateTokens,
	checkTokenAvailability,
	checkRefreshToken,
	logout,
	authenticate,
};
