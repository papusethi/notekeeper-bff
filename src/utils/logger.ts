import { blue, green, magenta, red, yellow } from 'colorette';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';
import util from 'util';
import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';

// Linking Trace Support
sourceMapSupport.install();

// Color to your console logs
const colorizeLevel = (level: string) => {
  switch (level) {
    case 'ERROR': {
      return red(level);
    }
    case 'INFO': {
      return blue(level);
    }
    case 'WARN': {
      return yellow(level);
    }
    default: {
      return level;
    }
  }
};

const consoleLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info;

  const customLevel = colorizeLevel(level.toUpperCase());
  const customTimestamp = green(timestamp as string);
  const customMessage = message;

  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true
  });

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`;

  return customLog;
});

const consoleTransport = () => {
  if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), consoleLogFormat)
      })
    ];
  } else {
    return [];
  }
};

const fileLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info;

  const logMeta: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta as object)) {
    if (value instanceof Error) {
      logMeta[key] = {
        name: value.name,
        message: value.message,
        trace: value.stack || ''
      };
    } else {
      logMeta[key] = value;
    }
  }

  const logdata = {
    level: level.toUpperCase(),
    message,
    timestamp,
    meta: logMeta
  };

  return JSON.stringify(logdata, null, 4);
});

const fileTransport = () => {
  return [
    new transports.File({
      filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
      level: 'info',
      format: format.combine(format.timestamp(), fileLogFormat)
    })
  ];
};

const mongodbTransport = () => {
  return [
    new transports.MongoDB({
      level: 'info',
      db: config.DATABASE_URL as string,
      metaKey: 'meta',
      expireAfterSeconds: 3600 * 24 * 30,
      options: { useUnifiedTopology: true },
      collection: 'application-logs'
    })
  ];
};

export default createLogger({
  defaultMeta: {
    meta: {}
  },
  transports: [...consoleTransport(), ...fileTransport(), ...mongodbTransport()]
});
