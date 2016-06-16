Wiremock is a tool for mocking the responses of REST APIs. See more at
http://wiremock.org

We use it for mocking the responses from persice.com backend when developing
UI for features that are not yet finished in the API, or when we want to
test edge ceases with less effort.

Requirements:
 - Java runtime
 - curl

Usage:
 1. Download Wiremock by running the downloadwiremock.sh script.
 1. Write mocking rules in .json files in 'mappings' directory. See
 wiremock.org/stubbing.html for more documentation. Example mappings are
 already provided.
 1. Run Wiremock by running the runwiremock.sh script.
 1. Edit your services to point to 'http://localhost:9999/' + usual API path.
