/*
Copyright - 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theConfig from './Config.js';
import fs from 'fs';
import theMySqlDb from './MySqlDb.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon...
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class TableLoader {

	/**
     * Coming soon...
     * @type {string}
     */

	createTableSql;

	/**
     * Coming soon...
     * @type {string}
     */

	fileName;

	/**
     * The constructor
     */

	constructor ( ) {

	}

	/**
     * Coming soon...
     * @param {string} data the data to load
     */

	#loadData ( data ) {
		console.info ( data );
	}

	/**
     * Coming soon...
     */

	#readFile ( ) {
		return fs.readFileSync (
			theConfig.srcDir + '/' + this.fileName,
			'utf8'
		);
	}

	/**
     * Coming soon...
     */

	async load ( ) {
		theMySqlDb.execSql ( this.createTableSql )
			.then (
				( ) => {
					console.info ( `table created for file ${this.fileName}` );
					this.#loadData ( this.#readFile ( ) );
				}
			)
			.catch ( err => console.info ( err ) );
	}
}

export default TableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */