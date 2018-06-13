'use strict';
const chalk = require('chalk');
const emoji = require('node-emoji');

const chalkHeader = chalk.white.underline;
const chalkNormal = chalk.white
const chalkActive = chalk.green;
const chalkHighlight = chalk.green;
const chalkError = chalk.bold.red;

class Display {
  static row(columnHeaders) {
    let output = '';
    for (const c of columnHeaders) {
      if (c.padStart) {
        if (typeof c.padStart === 'number') {
          output += ' '.repeat(c.padStart);
        } else if (typeof c.padStart === 'string') {
          output += c.padStart;
        }
      }

      let padSize = c.size - c.data.length;
      if (c.chalk) {
        var draw = c.chalk;
      } else {
        var draw = (chalk) => (chalk)
      }
      let data = draw(c.data) + ' '.repeat(padSize + 2);

      output += data;
    }
    return output;
  }

  /**
   * Returns pretty text output for showing a list of projects
   *
   * @param {Array} projects
   * @returns {String} console-ready text string
   */
  static displayProjectArray(aid, projects, activePid) {
    if (projects.length === 0) {
      return 'There are currently no projects associated to this account.';
    }

    // find the longest entry for each column
    let maxLength = {
      pid: 'Project ID'.length,
      projectName: 'Project Name'.length,
      leadsCount: 'Leads'.length
    };
    for (const p of projects) {
      for(const key of Object.keys(maxLength)) {
        let data;
        if (typeof p[key] !== 'string') {
          data = p[key].toString();
        } else {
          data = p[key];
        }

        if (data.length > maxLength[key]) {
          maxLength[key] = data.length;
        }
      }
    }

    var output = this.row([
      { data: 'Project ID', padStart: 3, size: maxLength.pid, chalk: chalkHeader },
      { data: 'Project Name', size: maxLength.projectName, chalk: chalkHeader },
      { data: 'Leads', size: maxLength.leadsCount, chalk: chalkHeader },
      { data: 'Public API Key', size: 34, chalk: chalkHeader },
      { data: 'Created', size: 40, chalk: chalkHeader}
    ]);

    for (const p of projects) {
      if (p.pid === activePid) {
        var padStart = chalkActive('🐿  ');
        var draw = chalkActive;
      } else {
        var padStart = 3;
        var draw = chalkNormal;
      }
      output += '\n' + this.row([
        { data: p.pid, padStart, size: maxLength.pid, chalk: draw },
        { data: p.projectName, size: maxLength.projectName, chalk: draw },
        { data: p.leadsCount.toString(), size: maxLength.leadsCount, chalk: draw },
        { data: `${p.publicApiKey}${aid}`, size: 34, chalk: draw },
        { data: p.created.toString(), size: 40, chalk: draw }
      ]);
    }

    return output;
  }

  static displayProject(pid, projectName) {
    return chalkHighlight(`${emoji.get('chipmunk')}  ${projectName} (${pid}) selected.`);
  }

  static stagingMode() {
    return `${emoji.get('warning')}  You are running in staging mode.`;
  }

  static displayAccount(accountData) {
    let output = '';
    output += chalk.cyan(`Account ID: ${chalk.white(accountData.aid)}\n`);
    output += chalk.cyan(`Email: ${chalk.white(accountData.email)}\n`);
    output += chalk.cyan(`Created: ${chalk.white(accountData.created.toString())}`);
    return output;
  }

  static noKey() {
    let output = chalk.white(`${emoji.get('warning')}  Run: ${chalk.cyan.bold('capturoo setup')}`);
    output += ` to setup this command line tool`;
    return output;
  }
}

module.exports = Display;
