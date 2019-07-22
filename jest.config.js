// jest.config.js
let environment = process.env.environment
let testPathIgnorePatterns = []

if(environment === "CI") testPathIgnorePatterns = ['tests-non-ci/']
if(environment === "noncionly") testPathIgnorePatterns = ['tests/']

module.exports = {
    verbose: true,
    testPathIgnorePatterns
};