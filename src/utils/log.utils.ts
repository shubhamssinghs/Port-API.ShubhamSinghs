/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LogEntry {
  log: string;
  [key: string]: any;
}

export interface FormattedLog {
  [key: string]: any;
}

/**
 * Format an array of log entries into a structured format.
 * @param logs - An array of log entries.
 * @returns An array of formatted log entries.
 */
export const formatLogs = (logs: LogEntry[]): FormattedLog[] => {
  if (!logs || logs.length === 0) {
    return [];
  }

  return logs.map((logEntry) => {
    try {
      const log = JSON.parse(logEntry.log);
      return {
        log,
        ...log
      };
    } catch (parseError) {
      console.error(`Error parsing log entry: ${logEntry.log}`, parseError);
      return {
        ...logEntry,
        error: 'Failed to parse log entry'
      };
    }
  });
};
