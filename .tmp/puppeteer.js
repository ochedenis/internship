const puppeteer = require('puppeteer');
const mongo = require('mongodb').MongoClient;
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const stream = require('stream');
const URL = 'http://localhost:3000/v1/users';
const MONGODB_URI = 'mongodb://localhost:27017/';
const MONGODB_DB = 'users_db';
const MONGODB_COLLECTION = 'GrabbingEmails';
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
const screen = new stream.PassThrough();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle2' });
  screen.end(await page.screenshot({ type: 'jpeg' }));
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

  new UploadFile(SCOPES, TOKEN_PATH).launch();
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
        db.collection(this.collectName)
          .insertOne({ emails: data, })
          .then(() => client.close());
      });
    } catch(error) {
      console.error(error.message);
    }
  }
}

class UploadFile {

  constructor(scope, tokenPath) {
    this.scope = scope;
    this.tokenPath = tokenPath;
  }

  launch() {
    fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      this.authorize(JSON.parse(content), this.uploadFile);
    });
  }

  authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    fs.readFile(this.tokenPath, (err, token) => {
        if (err) return this.getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
  }

  getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.scope,
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
            fs.writeFile(this.tokenPath, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', this.tokenPath);
            });
            callback(oAuth2Client);
        });
    });
  }

  uploadFile(auth) {
    google.drive({ version: 'v3', auth })
        .files.create({
            media: {
                mimeType: 'image/jpeg',
                body: screen
            },
            'requestBody': {
                'name': 'screenshot.jpg',
                 mimeType: 'image/jpeg',
            },
            fields: 'id',
        }, function (err, res) {
            if (err) {
              return console.error(error.message);
            }
        });
  }
}