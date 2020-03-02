/* eslint-disable max-statements */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/prefer-await-to-callbacks */
/* eslint-disable no-underscore-dangle */

'use strict';

const fs = require('fs');
const util = require('util');
const crypto = require('crypto');
const { Transform } = require('stream');
const fg = require('fast-glob');
const nanoid = require('nanoid');
const cacache = require('cacache');
const memoizeFs = require('memoize-fs');
const { toReadable } = require('stream-iterators-utils');
const serialize = require('serialize-javascript');
const { cosmiconfig } = require('cosmiconfig');

async function* globChanged(options) {
  const { include, globOptions, ...opts } = options;
  const cfg = { cacheLocation: './.cache/globbing', hooks: {}, ...opts };

  const {
    always = () => {},
    changed = () => {},
    notChanged = () => {},
    found = () => {},
    notFound = async ({ file }) => {
      await cacache.put(cfg.cacheLocation, file.path, file.contents);
    },
  } = cfg.hooks;

  const config = {
    ...globOptions,
    unique: true,
    absolute: true,
    objectMode: true,
    ignore: cfg.exclude,
  };

  // const argsContents = JSON.stringify({ patterns, config });
  // const argsCachePath = './.cache/glob-args';
  // const idItegrity = integrityFromContents(argsContents);
  // const idInfo = await cacache.get.hasContent(argsCachePath, idItegrity);

  // if (idInfo === null) {
  //   await cacache.put(argsCachePath, idItegrity, argsContents);
  // }

  const globStream = fg.stream(include, config);

  for await (const data of globStream) {
    const contents = await util.promisify(fs.readFile)(data.path);
    const integrity = integrityFromContents(contents);
    const info = await cacache.get.info(cfg.cacheLocation, data.path);
    const hash = await cacache.get.hasContent(cfg.cacheLocation, integrity);

    const file = {
      ...data,
      contents,
      size: contents.length,
      integrity,
    };

    const ctx = {
      file,
      changed: hash === false,
      notFound: info === null,
      cacache,
      cacheLocation: cfg.cacheLocation,
    };
    ctx.cacheFile = info;

    if (ctx.changed) {
      if (ctx.notFound) {
        await notFound(ctx, cfg);
      } else {
        await found(ctx, cfg);
      }
      await changed(ctx, cfg);
    } else {
      await notChanged(ctx, cfg);
    }
    await always(ctx, cfg);
    yield ctx;
  }
}

function hasha(value, { algorithm = 'sha512', digest = 'base64' }) {
  return crypto
    .createHash(algorithm)
    .update(value)
    .digest(digest);
}

function integrityFromContents(contents, hash = 'sha512') {
  const id = hasha(contents, { algorithm: hash });

  return `${hash}-${id}`;
}

const globCache = {
  stream: async function* globCacheStream(options) {
    // if (options.hooks) {
    //   console.warn('glob-cache: Using hooks on stream API is not recommended.');
    // }
    yield* globChanged(options);
  },
  promise: async function globCachePromise(options) {
    const stream = globChanged(options);
    const results = [];

    for await (const ctx of stream) {
      // do not put on memory if not necessary,
      // because we may want to just use the Hooks API
      if (options.buffered) {
        results.push(ctx);
      }
    }

    return results;
  },
};

function glob(...args) {
  return globCache.promise(...args);
}

glob.stream = globCache.stream;
glob.promise = globCache.promise;

module.exports = glob;
