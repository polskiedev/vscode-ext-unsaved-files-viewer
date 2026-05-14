const fs = require('fs');
const { execSync } = require('child_process');

const pkg = require('../package.json');

if (!fs.existsSync('.output')) {
  fs.mkdirSync('.output');
}

execSync(
  `vsce package -o .output/${pkg.name}-${pkg.version}.vsix`,
  { stdio: 'inherit' }
);
