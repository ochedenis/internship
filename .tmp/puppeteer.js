const puppeteer = require('puppeteer');
const mongo = require('mongodb').MongoClient;
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const URL = 'http://localhost:3000/v1/users';
const MONGODB_URI = 'mongodb://localhost:27017/';
const MONGODB_DB = 'users_db';
const MONGODB_COLLECTION = 'GrabbingEmails';
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.screenshot({path: 'screenshot.jpg'});
  const emails = await page.$$eval('.email', emails => {
  	let arr = [];
  	emails.forEach(email => arr.push(email.innerText));

  	return arr;
  });
 
  await browser.close();

  await new DbConnect(MONGODB_URI,
                      MONGODB_DB,
                      MONGODB_COLLECTION,
                      connectOptions,
                      emails).addToDb(emails);

  new UploadFile();
})();

class DbConnect {
  constructor(url, dataBase, collectName, options) {
    this.url = url;
    this.dataBase = dataBase;
    this.collectName = collectName;
    this.options = options;
  }

  async addToDb(data) {
    try {
      mongo.connect(this.url, this.options, (error, client) => {
        if(error) {
          throw error;
        }

        const db = client.db(this.dataBase);
        db.collection(this.collectName).insertOne({ emails: data, });
        // closes session before added data to database - found only this way to fix it
        setTimeout(() => client.close(), 2000);
      });
    } catch(error) {
      console.error(error.message);
    }
  }
}

class UploadFile {
  SCOPES = ['https://www.googleapis.com/auth/drive'];
  TOKEN_PATH = 'token.json';

  constructor() {
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      this.authorize(JSON.parse(content), this.uploadFile);
    });
  }

  /**
    * Create an OAuth2 client with the given credentials, and then execute the
    * given callback function.
    * @param {Object} credentials The authorization client credentials.
    * @param {function} callback The callback to call with the authorized client.
  */
  authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(this.TOKEN_PATH, (err, token) => {
        if (err) return this.getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
  }

  /**
    * Get and store new token after prompting for user authorization, and then
    * execute the given callback with the authorized OAuth2 client.
    * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
    * @param {getEventsCallback} callback The callback for the authorized client.
  */
  getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', this.TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
  }

  uploadFile(auth) {
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
        'name': 'screenshot.jpg',
    };
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('screenshot.jpg'),
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
    }, function (err, res) {
        if (err) {
          return console.error(error.message);
        }
    });
  }
}