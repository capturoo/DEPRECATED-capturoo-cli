# CHANGELOG
## 0.7.0 (19 June 2018)
+ Leads query export CSV and JSON formats stdout and file
+ Bunyan logging to .capturoo directory
+ scripts/link-deps for local development environment configuration

## 0.6.4 (14 June 2018)
+ For staging mode use ~/.config-staging.json file

## 0.6.3 (14 June 2018)
+ Uses store 4.1.2 which no longer uses babel

## 0.6.2 (14 June 2018)
+ Uses store 4.1.1 which includes full library

## 0.6.0 (14 June 2018)
+ manage component renamed to store
+ uses 1.0.0 releases of app, auth and store 4.1.0
+ Fixes bug when running last-lead with 0 results

## 0.5.0 (13 June 2018)
+ Uses server manager pattern to load commands with factories
+ Revised syntax to use ES6 Classes
+ Color terminal output
+ Emojis to liven up display output
+ Removes columify dependency in favour of custom code
+ Ora spinner

## 0.4.2-alpha (25 May 2018)
+ Fix broken endpoint to use SSL

## 0.4.1-alpha (25 May 2018)
+ Redeploy to fix broken npm publish release
+ This release is broken for staging server

## 0.4.0-alpha (25 May 2018)
+ capturoo projects:create prompts to create a new project

## 0.2.0-alpha (24 May 2018)
+ [capturoo command without sub-command should show help screen #2](https://github.com/capturoo/capturoo-cli/issues/2)

## 0.1.2 (1 May 2018)
+ Adds link to GitHub page

## 0.1.1 (1 May 2018)
+ Add README.md file

## 0.1.0 (1 May 2018)
+ Initial release including
+ capturoo account  - shows account details
+ capturoo projects - list all projects for the account assocated to the private api key
+ capturoo -p <projectid> leads - show leads for a given project

