const rewire = require('rewire');
const app = rewire('./index.js');

const format_subject = app.__get__('format_subject');

test('Removes the subject', () => {
	expect(format_subject('Document from my reMarkable: 20220402')).toBe('20220402');
	expect(format_subject('Document from my remarkable: 2022040333')).toBe('2022040333');
	expect(format_subject('Document from my rexMarkable: 20220402')).toBe('Document from my rexMarkable: 20220402');
});
