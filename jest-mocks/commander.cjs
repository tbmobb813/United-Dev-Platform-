// Jest mock for commander (ESM/CJS safe)
const Command = jest.fn(function () {
  let actionHandler = null;
  let commandName = '';
  let positionalCount = 0;
  const longToMeta = {};
  const shortToLong = {};

  const parseOptionSpec = (flags, defaultValue) => {
    const parts = String(flags)
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);

    let longName = '';
    let shortName = '';
    let expectsValue = false;

    for (const part of parts) {
      if (part.startsWith('--')) {
        const token = part.split(/[\s<[]/)[0];
        longName = token.replace(/^--/, '');
        expectsValue = /<.+>|\[.+\]/.test(part);
      }
      if (part.startsWith('-') && !part.startsWith('--')) {
        shortName = part.split(/[\s<[]/)[0].replace(/^-/, '');
      }
    }

    if (longName) {
      longToMeta[longName] = { expectsValue, defaultValue };
      if (shortName) {
        shortToLong[shortName] = longName;
      }
    }
  };

  return {
    name: jest.fn().mockReturnThis(),
    command: jest.fn(function (spec) {
      const tokens = String(spec || '').trim().split(/\s+/).filter(Boolean);
      commandName = tokens[0] || '';
      positionalCount = tokens.slice(1).filter((token) => token.startsWith('[') || token.startsWith('<')).length;
      return this;
    }),
    description: jest.fn().mockReturnThis(),
    version: jest.fn().mockReturnThis(),
    option: jest.fn(function (flags, _desc, defaultValue) {
      parseOptionSpec(flags, defaultValue);
      return this;
    }),
    action: jest.fn(function (handler) {
      actionHandler = handler;
      return this;
    }),
    exitOverride: jest.fn().mockReturnThis(),
    parseAsync: jest.fn(async function (args) {
      if (!actionHandler) {
        return undefined;
      }

      const input = Array.isArray(args) ? [...args] : [];
      if (commandName && input[0] === commandName) {
        input.shift();
      }

      const options = {};
      for (const [name, meta] of Object.entries(longToMeta)) {
        if (meta.defaultValue !== undefined) {
          options[name] = meta.defaultValue;
        }
      }

      const positional = [];
      for (let index = 0; index < input.length; index += 1) {
        const token = input[index];
        if (typeof token !== 'string') {
          positional.push(token);
          continue;
        }
        if (token.startsWith('--')) {
          const longName = token.slice(2);
          const meta = longToMeta[longName] || { expectsValue: false };
          if (meta.expectsValue) {
            const nextValue = input[index + 1];
            if (nextValue !== undefined && !String(nextValue).startsWith('-')) {
              options[longName] = nextValue;
              index += 1;
            }
          } else {
            options[longName] = true;
          }
          continue;
        }
        if (token.startsWith('-') && token.length > 1) {
          const shortName = token.slice(1);
          const longName = shortToLong[shortName];
          if (longName) {
            const meta = longToMeta[longName] || { expectsValue: false };
            if (meta.expectsValue) {
              const nextValue = input[index + 1];
              if (nextValue !== undefined && !String(nextValue).startsWith('-')) {
                options[longName] = nextValue;
                index += 1;
              }
            } else {
              options[longName] = true;
            }
            continue;
          }
        }
        positional.push(token);
      }

      const positionalArgs = positional.slice(0, positionalCount);
      while (positionalArgs.length < positionalCount) {
        positionalArgs.push(undefined);
      }

      if (Object.keys(longToMeta).length > 0) {
        await actionHandler(...positionalArgs, options);
      } else {
        await actionHandler(...positionalArgs);
      }
      return undefined;
    }),
    parse: jest.fn().mockReturnThis(),
  };
});

module.exports = { Command, default: Command };
