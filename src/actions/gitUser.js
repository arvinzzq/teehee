const exec = require('child_process').execSync;

module.exports = () => {
  const name = exec('git config --get user.name');
  const email = exec('git config --get user.email');
  return {
    author: `${name.toString().trim()}<${email.toString().trim()}>`
  };
};
