const fs = require('node:fs');
const content = 'User-agent: *\nDisallow: /';
fs.writeFile('build/robots.txt', content, err => {
  if (err) {
    console.error(err);
  } else {
  }
});
