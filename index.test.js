const rewire = require('rewire');
const app = rewire('./index.js');

const format_subject = app.__get__('format_subject');
const array_of_emails = app.__get__('array_of_emails');
const check_allowed = app.__get__('check_allowed');
const format_body = app.__get__('format_body');

test('Removes the subject', () => {
	expect(format_subject('Document from my reMarkable: 20220402')).toBe('20220402');
	expect(format_subject('Document from my remarkable: 2022040333')).toBe('2022040333');
	expect(format_subject('Document from my rexMarkable: 20220402')).toBe('Document from my rexMarkable: 20220402');
});

test('Process emails into array', () => {
	const email_string = "me@me.com, you@you.com";
	const email_string_2 = "me@me.com , you@you.com";
	const email_array = ["me@me.com", "you@you.com"];
	expect(array_of_emails(email_string)).toEqual(email_array);
	expect(array_of_emails(email_string_2)[0]).toBe("me@me.com");
	expect(array_of_emails(email_string)[1]).toEqual(email_array[1]);
});

test('Check if I can process', () => {
	const authorized_emails = ['me@me.com','test1@me.com'];
	const authorized_name = 'test.user';
	const input_string = {value: [ { address: 'me@me.com', name: 'test.user' } ]};
	expect(check_allowed(input_string,{authorized_emails,authorized_name})).toBe(true);
	expect(check_allowed(input_string,{authorized_emails:['not_me@me.com'],authorized_name})).toBe(true);
	expect(check_allowed(input_string,{authorized_emails,authorized_name:'not.me'})).toBe(true);
	expect(check_allowed(input_string,{authorized_emails:['not@me.com'],authorized_name: 'not.1me'})).toBe(false);
	expect(check_allowed(input_string,{authorized_emails:['not@me.com', 'me@me.com'],authorized_name:'not.1me'})).toBe(true);
});

test('Body formatting', () => {
	const text = 'with attachment\n' +
    '---------- Forwarded message ---------\n' +
    'From: andrew.wippler <my@remarkable.com>\n' +
    'Date: Thu, Apr 21, 2022 at 6:09 PM\n' +
    'Subject: Document from my reMarkable: SCAN0025.PDF\n' +
    'To: <me@me.com>\n' +
    '\n' +
    '\n' +
    'Words Here\n' +
    '\n' +
    '--\n' +
    'Sent from my reMarkable paper tablet\n' +
    'Get yours at www.remarkable.com\n' +
    '\n' +
    'PS: You cannot reply to this email\n';
	// remove signature and forwarded message and glue with spaces into one long string
	expect(format_body(text)).toBe("with attachment Words Here");

});
