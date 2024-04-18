# ConfigCat Docs

A public repository for the ConfigCat documentation. https://configcat.com/docs

## About ConfigCat

ConfigCat is a feature flag, feature toggle, and configuration management service. That lets you launch new features and change your software configuration remotely without actually (re)deploying code. ConfigCat even helps you do controlled roll-outs like canary releases and blue-green deployments. https://configcat.com

# Prerequisites

Latest LTS version of [Node.js](https://nodejs.org/).

## Quick start

1. Open Terminal/CMD/PowerShell and change directory to `/website`
   ```
   cd website
   ```
2. Install packages
   ```
   npm install
   ```
3. Run
   ```
   npm start
   ```
   Browser window should open automagically. If not, visit: http://localhost:3000

# Guides for Docusaurus

https://docusaurus.io/

# Guide for Schema markups

Schema markups helps improving the SEO of the page. There are lots of schema markup types.
Currently, we are using the `FAQ Page` and `How-to` types.

1. Generation
   You can generate schema markups at e.g.: https://technicalseo.com/tools/schema-markup-generator  
   After generating the schema markup, you should copy and paste the json content from the generated script to a .json file. Only the .json part should be copied, the script tag will be inserted when we use it later.  
   The .json file's location should be under the website/src/schema-markup/... folder. Please use the same directory structure just like at the docs part.

2. Usage
   In the  files you can inject the schema markup with a similar code:

```javascript
export const NetSchema = require('@site/src/schema-markup/sdk-reference/net.json');
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(NetSchema) }}
></script>;
```

## Run locally using Docker

1. Have [Docker](https://www.docker.com) CLI installed

2. Crate container
   ```bash
   docker build -t docs:latest .
   ```
3. Run container (you might need to replace environment variables)
   ```bash
   docker run -i --publish 8000:80 --name docs docs:latest
   ```
4. Open `http://localhost:8000`

# Contributions

Contributions are welcome via PR.

# Troubleshooting

### Make sure you have the proper Node.js version installed

You might run into errors caused by the wrong version of Node.js. To make sure you are using the recommended Node.js version follow these steps.

1. Have nvm (Node Version Manager - https://github.com/nvm-sh/nvm ) installed:
1. Run `nvm install`. This will install the compatible version of Node.js.
1. Run `nvm use`. This will use the compatible version of Node.js.
1. Your local Node.js version (`node -v`) should be the same as in the `.nvmrc` file.

# Questions & Support

We are happy to help.
https://configcat.com/support
