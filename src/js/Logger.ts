export class Logger {
    private enabled;
    private msgPrefix;

    constructor (enabled: boolean, prefix) {
      this.enabled = enabled
      this.msgPrefix = prefix
    }

    /**
     * Log debug message to console
     * @param msg
     */
    public debug (msg, force = false) {
      if (this.enabled || force) {
        // eslint-disable-next-line no-console
        console.log(`${new Date().toISOString()} %c DEBUG %c${this.msgPrefix}: %c${msg}`, 'color:#28a745;', 'color:lightblue;', 'color:grey;')
      }
    }

    /**
     * Log debug message to console
     * @param msg
     */
    public info (msg, force = false) {
      if (this.enabled || force) {
        // eslint-disable-next-line no-console
        console.log(`${new Date().toISOString()} %c INFO %c${this.msgPrefix}: %c${msg}`, 'color:cornflowerblue;', 'color:lightblue;', 'color:grey;')
      }
    }

    /**
     * Log warning message to console
     * @param msg
     */
    public warn (msg, force = false) {
      if (this.enabled || force) {
        // eslint-disable-next-line no-console
        console.log(`${new Date().toISOString()} %c WARN %c${this.msgPrefix}: %c${msg}`, 'color:cornflowerblue;', 'color:lightblue;', 'color:orange;')
      }
    }

    /**
     * Log error message to console
     * @param msg
     */
    public error (msg, force = false) {
      if (this.enabled || force) {
        // eslint-disable-next-line no-console
        console.log(`${new Date().toISOString()} %c ERR %c${this.msgPrefix}: %c${msg}`, 'color:cornflowerblue;', 'color:lightblue;', 'color:crimson;')
      }
    }
}
