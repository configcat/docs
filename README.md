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
In the .md files you can inject the schema markup with a similar code:  
``` javascript
export const NetSchema = require('@site/src/schema-markup/sdk-reference/net.json');
<script type='application/ld+json' dangerouslySetInnerHTML={ { __html: JSON.stringify(NetSchema) }}></script>
```

# Contributions

Contributions are welcome via PR.

# Troubleshooting
If you face any strange errors when trying to run locally, please check if you have the latest LTS version of [Node.js](https://nodejs.org/).

# Questions & Support

We are happy to help.
https://configcat.com/support