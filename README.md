# Remarkable email to Notion

I like control of my data and utilizing what is already free to me. This project is not intended to replace services such as [https://taskrobin.io/](taskrobin.io). (Although, remarkable sends from the same email address which might break the service.)

## Overall scope
1. Send an email from remarkable (Attachment or Text)
2. Receive email from AmazonSES (which stores it in S3)
3. Use Lambda to process the file in S3 and Upload it to Notion

## License

Apache 2.0

## Contributing

Contributions accepted if they do not abrupt my workflow.

## Docs

1. https://developers.notion.com/docs/getting-started  
(Create a new notion database. The default settings will do; however, I have removed the tags column. The script will add email text to the child of the page.)
2. https://www.qloudx.com/automate-incoming-email-processing-with-amazon-ses-aws-lambda/
3. https://docs.aws.amazon.com/ses/latest/dg/regions.html#region-receive-email  


## Misc Debugging

1. Ensure the lambda function has access to the S3 bucket.
2. Increase the RAM to 256mb on the function.
3. `aws_upload.sh` is a helper to upload the code to aws.
4. Ensure you have SES incoming email routed properly (it involves an MX record that begins with `inbound`. (See number 3 link in docs.)


