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
     * @type {number}
     */

	static get VARCHAR_LENGHT_5 ( ) { return 5; }

	/**
     * Coming soon...
     * @type {number}
     */

	// eslint-disable-next-line no-magic-numbers
	static get VARCHAR_LENGHT_64 ( ) { return 64; }

	/**
     * Coming soon...
     * @type {number}
     */

	// eslint-disable-next-line no-magic-numbers
	static get VARCHAR_LENGHT_256 ( ) { return 256; }

	/**
    * Coming soon...
    * @type {Map}
   */

	fieldsMap = new Map ( );

	/**
     * The constructor
     */

	constructor ( ) {

	}

	/**
     * Coming soon...
     * @param {string} data the data to load (= the contains of the file)
     */

	#loadData ( data ) {

		// data is splited into lines
		let dataLines = data.split ( /\r\n|\r|\n/ );
		let insertSqlString = '';
		let insertSqlStringHeader = '';
		dataLines.forEach (
			dataLine => {

				// first line contains the fields names
				if ( '' === insertSqlStringHeader ) {
					insertSqlStringHeader = this.getInsertSqlStringHeader ( dataLine );
				}
				else if ( '' !== dataLine ) {

					// line is splited into fields values
					let fieldValues = dataLine.split ( ',' );
					insertSqlString = insertSqlStringHeader;
					fieldValues.forEach (
						fieldValue => insertSqlString += fieldValue + ', '
					);
					insertSqlString = insertSqlString.slice ( 0, insertSqlString.length - 2 );
					insertSqlString += ');';
					console.log ( 'insertSqlString' );
					console.log ( insertSqlString );
				}

			}
		);
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

	#getCreateTableSqlString ( ) {
		let createTableSqlString = 'CREATE TABLE IF NOT EXISTS `gtfs02`.`' + this.tableName + '` (';
		this.fieldsMap.forEach (
			( value, key ) => createTableSqlString += '`' + key + '` ' +
			value.type + ( ( 0 < value.length ) ? '(' + value.length + '), ' : ', ' )
		);
		createTableSqlString = createTableSqlString.slice ( 0, createTableSqlString.length - 2 );
		createTableSqlString += ') DEFAULT CHARACTER SET utf8mb4  COLLATE utf8mb4_0900_ai_ci;';

		return createTableSqlString;
	}

	/**
     * Coming soon...
     */

	async load ( ) {
		theMySqlDb.execSql ( this.#getCreateTableSqlString ( ) )
			.then (
				( ) => {
					console.info ( `table created for file ${this.fileName}\n\n` );
					this.#loadData ( this.#readFile ( ) );
				}
			)
			.catch ( err => console.info ( err ) );
	}
}

export default TableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */