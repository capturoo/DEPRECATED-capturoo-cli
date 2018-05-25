# capturoo-cli

## Installation
You need to install [Node.js](https://nodejs.org/) and [npm](https://npmjs.org/). Note that
installing Node.js should install npm as well.

Once npm is installed, get the Capturoo CLI by running the following command:
``` sh
npm install -g @capturoo/capturoo-cli
```

This will provide you with the globally accessible `capturoo` command.

To use the Capturoo CLI, you first need to [sign up for a Capturoo account](https://www.capturoo.com).

## Commands
`capturoo --help` lists the available commands and `capturoo <command> --help` shows more details for an individual command.

### Create a new project
Example usage.

```
capturoo projects:create
? Name of your project:  Promotion Campaign Site
? Alocate a project ID (lowercase including hyphen) promotion-xyz
```

After your project has been created, retrieve your public key using `capturoo projects:list`.

## License
MIT
