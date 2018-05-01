'use strict';
const columnify = require('columnify');

class Utils {
  /**
   * Returns pretty text output for showing a list of projects
   *
   * @param {Array} projects
   * @returns {String} console-ready text string
   */
  static displayProjectArray(projects) {
    if (projects.length === 0) {
      return 'There are currently no projects associated to this account.';
    }

    let data = projects.map(
      p => ({
        projectId: p.projectId,
        name: p.name,
        created: p.created
      })
    );

    return columnify(data, {
      columnSplitter: ' | ',
      showHeaders: true,
      columns: ['projectId', 'name', 'created'],
      config: {
        projectId: {
          headingTransform: projectId => ('Project ID')
        },
        name: {
          headingTransform: heading => ('Project Name')
        },
        created: {
          headingTransform: heading => ('Created')
        }
      }
    });vim
  }
}

module.exports = Utils;
