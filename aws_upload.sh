#!/bin/bash
zip -r lambda.zip *.js aws_update.sh node_modules/ 
echo "Uploading..."
aws lambda update-function-code \
    --function-name  remarkable-email-processing \
    --zip-file fileb://lambda.zip --publish

rm lambda.zip
