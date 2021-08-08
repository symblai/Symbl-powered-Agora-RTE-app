const {series, parallel} = require('gulp');
const {exec} = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const del = require('del');
const args = require('yargs').argv;

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.renderer.config');

const log = (x) => (args.info ? console.log(x) : null);
const BUILD_PATH = path.join(__dirname, '.electron');

const runCli = (cmd, cb) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      log(`error: ${error.message}`);
    } else if (stderr) {
      log(`stderr: ${stderr}`);
    } else {
      log(`stdout: ${stdout}`);
    }
    cb();
  });
};

function clean() {
  return del([`${BUILD_PATH}/**/*`]);
}

function renderer(cb) {
  runCli('webpack --config webpack.renderer.config.js', cb);
}

function main(cb) {
  runCli('webpack --config ./webpack.main.config.js', cb);
}

async function packageJson(cb) {
  let package = JSON.parse(
    await fs.readFile(path.join(__dirname, 'package.json')),
  );
  let {
    name,
    version,
    private,
    author,
    description,
    dependencies,
    optionalDependencies,
  } = package;
  let nativeDeps = require('./nativeDeps').default;
  let natives = {};
  let searchDeps = {
    ...dependencies,
    ...optionalDependencies,
  };
  nativeDeps.map((k) => {
    natives[k] = searchDeps[k];
  });

  let newPackage = {
    name,
    version,
    private,
    author,
    description,
    dependencies: natives,
    agora_electron: {
      electron_version: '5.0.8',
      prebuilt: true,
    },
  };
  await fs.writeFile(
    path.join(BUILD_PATH, 'package.json'),
    JSON.stringify(newPackage, null, 2),
  );
  return;
}

function build(cb) {
  runCli('electron-builder build --config ./electron-builder.js', cb);
}

function electronDevServer(cb) {
  const config = webpack(webpackConfig);
  new WebpackDevServer(config, {
    hot: true,
  }).listen(webpackConfig.devServer.port, 'localhost', (err) => {
    if (err) {
      console.error(err);
    } else {
      cb();
    }
  });
}

function mainDev(cb) {
  runCli('webpack --config ./webpack.main.config.js', cb);
}

function start(cb) {
  runCli('electron .', cb);
}

module.exports.build = series(
  clean,
  parallel(renderer, main, packageJson),
  build,
);

module.exports.development = series(clean, electronDevServer, mainDev, start);
