#!/usr/bin/env node
'use strict';
const program = require('commander');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const runner = sh => {
  return new Promise(resolve => {
    exec(sh, { cwd: process.cwd() }, (err, msg) => {
      if (err) {
        console.log(err.message);
        resolve();
      } else {
        console.log(msg);
        resolve();
      }
    });
  });
};

program.version('1.0.0');

program.command('rsa').action(async function() {
  const private_path = path.join(
    process.cwd(),
    './config/rsa/rsa_private_key.pem'
  );
  const public_path = path.join(
    process.cwd(),
    './config/rsa/rsa_public_key.pem'
  );

  await runner(`openssl genrsa -out ${private_path} 1024`);
  await runner(`openssl rsa -in ${private_path} -pubout -out ${public_path}`);

  console.log(`生成rsa文件成功`);
  console.log(`私钥路径:${private_path}`);
  console.log(`公钥路径:${public_path}`);
});

program
  .command('migrate')
  .option(
    '-e, --env [env]',
    'The environment to run the command in',
    'development'
  )
  .action(async function(options) {
    const plugins = require(path.join(process.cwd(), './config/plugin.js'));
    for (const pluginName of Object.keys(plugins)) {
      const pkg = plugins[pluginName];
      if (!pkg.enable || !pkg.package) continue;
      const migrations_dir =path.join(process.cwd(), './node_modules', pkg.package , 'migrations')
      const has_mig_dir = fs.existsSync(migrations_dir)
      if (!has_mig_dir) continue;
      const stat = fs.statSync(migrations_dir);
      if (!stat.isDirectory()) continue;

      console.log(`运行插件 [${pluginName}] 的migrations文件...`);
      await runner(
        `npx sequelize db:migrate --env=${options.env} --config=${path.join(
          process.cwd(),
          './database/config.json'
        )} --migrations-path=${migrations_dir}`
      );
    }

    console.log(`运行项目根目录下的migrations文件...`);
    await runner(
      `npx sequelize db:migrate --env=${options.env} --config=${path.join(
        process.cwd(),
        './database/config.json'
      )}`
    );
  });

program
  .command('add')
  .description('add a migration')
  .option('-p, --plugin [name]', 'Which setup mode to use')
  .option(
    '-e, --env [env]',
    'The environment to run the command in',
    'development'
  )
  .option('-c, --config [path]', 'The path to the config file')
  .option(
    '-o, --options-path  [path]',
    'The path to a JSON file with additional options'
  )
  .option(
    '-s, --seeders-path  [path]',
    'The path to the seeders folder',
    'seeders'
  )
  .option(
    '-m, --models-path  [path]',
    'The path to the models folder',
    'models'
  )
  .option(
    '-u, --url  [url]',
    'The database connection string to use. Alternative to using --config files'
  )
  .option('-d, --debug', 'When available show various debug information', false)
  .requiredOption('-n, --name [name]', 'Defines the name of the migration')
  .option(
    '-ud, --underscored',
    "Use snake case for the timestamp's attribute names",
    false
  )
  .action(function(options) {
    const args = [];
    if (options.env) args.push(`--env=${options.env}`);
    if (options.config) args.push(`--config=${options.config}`);
    if (options['options-path']) {
      args.push(`--options-path=${options['options-path']}`);
    }

    if (options['seeders-path']) {
      args.push(`--seeders-path=${options['seeders-path']}`);
    }

    if (options['models-path']) {
      args.push(`--models-path=${options['models-path']}`);
    }

    if (options.url) args.push(`--url=${options.url}`);
    if (options.name) args.push(`--name=${options.name}`);
    if (options.debug) args.push('--debug');
    if (options.underscored) args.push('--underscored');

    if (options.plugin) {
      args.push(
        `--migrations-path=${path.join(
          process.cwd(),
          `lib/plugin/egg-coca-${options.plugin}`,
          'migrations'
        )}`
      );
    }

    exec(`npx sequelize migration:generate ${args.join(' ')}`, function(
      err,
      msg
    ) {
      if (err) {
        console.log(err.message);
      } else {
        console.log(msg);
      }
    });
  });

program.parse(process.argv);
