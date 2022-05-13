const util = require('node:util');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const { Client } = require("@notionhq/client");
const simpleParser = require('mailparser').simpleParser;

const bucket = process.env.S3_BUCKET || '';
const notion = new Client({
  auth: process.env.NOTION_KEY,
});
const databaseId = process.env.NOTION_DATABASE_ID;
const authorized_emails = process.env.COMMA_SEPARATED_EMAILS || 'my@remarkable.com';
const authorized_name = process.env.REMARKABLE_FROM_NAME || '';

// function to split emails into an array
function array_of_emails(emails) {
	return emails.replace(/\s/g, '').split(",");
}

// function to erase 'Document from my reMarkable: ' from subject
function format_subject(subject) {
	return subject.replace(/^Document from my reMarkable: /i, '');
}

// function to make sure we can send email here (safe sender list)
function check_allowed(from, data) {
	let from_email = from.value[0].address;
	let from_name = from.value[0].name;
	if (data.authorized_emails.includes(from_email)) { return true; }
	if (data.authorized_name == from_name) { return true; }

	return false
}

// Remove unneeded data and glue into one long string
function format_body(text) {
				const text_array = text.split('\n');
				let new_text=[];
				//console.log(util.inspect(text_array));
				
				for(let i = 0; i < text_array.length; i++)
				{			
					let line = text_array[i];
					//skip forwarded messages
					if (line == "---------- Forwarded message ---------") {
							i = i + 4;
							continue;
					}
					// skip signature start line and empty lines
					if (line == "--" || line === "") {continue;}
				  // skip remarkable advertisement			
					if (line == "Sent from my reMarkable paper tablet") {
							i = i+3;
							continue;
					}
				new_text.push(line);
				
				}
				return new_text.join(" ");
}

exports.handler = function (event, context, callback) {
    S3.getObject({
	Bucket: bucket,
        Key: 'remarkable/' + event.Records[0].ses.mail.messageId
    }, function (err, data) {
        if (err) callback(err);
        else {
		simpleParser(data.Body, (err, mail) => {
			let from = mail.headers.get('from');
			let subject = format_subject(mail.headers.get('subject'));
			if (check_allowed(from,{authorized_emails,authorized_name})) {
				// attachment
				if (mail.attachments.length > 0 && mail.attachments.length < 2) {
					// Remarkable only sends 1 attachment
					// Someone could theoretically use this code here and create
					// additional logic to create more pages based upon attachments
					// 
					console.log('Uploaded files not supported by notion yet');
					// File uploads not yet enabled in the API. Will leave this commented out for now
					//notion.pages.create({
          				//	parent: { database_id: databaseId },
          				//	properties: {
					//		Name: {
					//			title: [{type: "text", text: { content: subject} }],
					//		},
					//		"Files": {
   					//			 "files": [
      					//				{		
        				//					"type": "external",
        				//					"name": "Space Wallpaper",
        				//					"external": {
            				//						"url": "https://website.domain/images/space.png"
        				//					}
      					//				}
    					//			]
  					//		}
					//	},
        				//	});
				}

				// just text
				notion.pages.create({
								parent: {database_id: databaseId },
								properties: {
												Name: {
																title: [{type: "text", text: {content: subject} }],
												},
								},
							  children: [
      						{
        						object: 'block',
        						type: 'paragraph',
        						paragraph: {
          						rich_text: [
            					{
              					type: 'text',
              					text: {
          								"content": format_body(mail.text),
              					},
            					},
          						],
        						},
      						},
    						],
				});



				//console.log(util.inspect(mail, false, 22));
			}
		});
        }
    });
};
