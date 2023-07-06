import { format, createLogger, transports } from "winston";

const { combine, timestamp, printf } = format;
import "winston-daily-rotate-file";

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "src/logs/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: 5,
});

const logger = createLogger({
  level: "debug",
  format: combine(timestamp(), customFormat),
  transports: [fileRotateTransport, new transports.Console()],
});

export default logger;
