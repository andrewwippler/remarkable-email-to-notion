const S3 = require('aws-sdk/clients/s3');
const { Client } = require("@notionhq/client");

const bucket = process.env.S3_BUCKET || '';
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const authorized_emails = process.env.COMMA_SEPARATED_EMAILS || 'my@remarkable.com';
const remarkable_from = process.env.REMARKABLE_FROM_NAME || '';

// function to split emails into an array
//
// function to erase 'Document from my reMarkable: ' from subject
function format_subject(subject) {
	return subject.replace(/^Document from my reMarkable: /i, '');
}

exports.handler = function (event, context, callback) {
    S3.getObject({
        bucket,
        Key: event.Records[0].ses.mail.messageId
    }, function (err, data) {
        if (err) callback(err);
        else {
            // process email (data.Body) here
            callback(null, null);
        }
    });
};
