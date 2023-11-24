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
	 * Coming soon
	 * @type {Array}
	 */

	#fieldsList = [];

	/**
     * The constructor
     */

	constructor ( ) {

	}

	/**
	 * Coming soon...
	 * @param {String} dataLine Coming soon...
	 */

	#getFieldsValues ( dataLine ) {
		let tmpFieldsValues = dataLine.split ( '"' );
		let tmpDataLine = '';

		// console.log ( tmpFieldsValues );
		let tmpFieldsValuesCounter = 0;
		for ( tmpFieldsValuesCounter = 0; tmpFieldsValuesCounter < tmpFieldsValues.length; tmpFieldsValuesCounter ++ ) {
			if ( 0 !== ( tmpFieldsValuesCounter % 2 ) ) {
				tmpFieldsValues [ tmpFieldsValuesCounter ] =
					tmpFieldsValues [ tmpFieldsValuesCounter ].replaceAll ( ',', 'çççççç' );
			}
			tmpDataLine += tmpFieldsValues [ tmpFieldsValuesCounter ];
		}
		tmpFieldsValues = tmpDataLine.split ( ',' );

		for ( tmpFieldsValuesCounter = 0; tmpFieldsValuesCounter < tmpFieldsValues.length; tmpFieldsValuesCounter ++ ) {
			tmpFieldsValues [ tmpFieldsValuesCounter ] =
				tmpFieldsValues [ tmpFieldsValuesCounter ].replaceAll ( 'çççççç', ',' );
		}
		return tmpFieldsValues;
	}

	/**
     * Coming soon...
	 * @param {String} fileName Comming soon...
     */

	#readFile ( fileName ) {
		return fs.readFileSync (
			theConfig.srcDir + '/' + fileName,
			'utf8'
		);
	}

	/**
     * Coming soon...
     * @param {string} dataLine
     * @returns {string} the header of the sql
     */

	#getInsertSqlStringHeader ( dataLine ) {
		let fields = dataLine.split ( ',' );
		let sqlStringHeader = ' INSERT INTO `' + theConfig.dbName + '`.`' + this.tableName + '` (';
		fields.forEach (
			field => {
				sqlStringHeader += '`' + field + '`, ';
				this.#fieldsList.push ( field );
			}
		);
		sqlStringHeader = sqlStringHeader.slice ( 0, sqlStringHeader.length - 2 );
		sqlStringHeader += ') VALUES (';

		return sqlStringHeader;
	}

	/**
     * Coming soon...
	 * @param {String} fileName Comming soon...
      */

	async loadData ( fileName ) {

		try {
			fs.accessSync ( theConfig.srcDir + '/' + fileName );
		}
		catch ( err ) {
			console.error ( `File ${fileName} not found` );
			return;
		}

		console.info ( `Loading of file ${fileName} started` );
		let dataLines = this.#readFile ( fileName ).split ( /\r\n|\r|\n/ );
		let insertSqlString = '';
		let insertSqlStringHeader = '';
		let commitCounter = 0;
		let dataLinesCounter = 0;
		for ( dataLinesCounter = 0; dataLinesCounter < dataLines.length; dataLinesCounter ++ ) {

			// first line contains the fields names
			if ( '' === insertSqlStringHeader ) {
				insertSqlStringHeader =
					this.#getInsertSqlStringHeader ( dataLines [ dataLinesCounter ].replaceAll ( '"', '' ) );
			}
			else if ( '' !== dataLines [ dataLinesCounter ] ) {

				// line is splited into fields values
				let fieldValues = this.#getFieldsValues ( dataLines [ dataLinesCounter ] );
				let fieldCounter = 0;
				insertSqlString = insertSqlStringHeader;
				fieldValues.forEach (
					fieldValue => {
						let separator =
						'varchar' === this.fieldsMap.get ( this.#fieldsList [ fieldCounter ] ).type
						||
						'time' === this.fieldsMap.get ( this.#fieldsList [ fieldCounter ] ).type
							?
							'\''
							:
							'';

						insertSqlString += separator +
							fieldValue.replaceAll ( '"', '' ).replaceAll ( '\'', '´' ) +
							separator + ', ';
						fieldCounter ++;
					}
				);
				insertSqlString = insertSqlString.slice ( 0, insertSqlString.length - 2 );
				insertSqlString += ');';

				theMySqlDb.execSql ( insertSqlString )
					.then ( )
					.catch ( /* () => console.error ( `An error occurs when executing ${insertSqlString}` )*/ );

				// commit...
				commitCounter ++;

				if ( theConfig.commitCounter <= commitCounter ) {
					console.info ( `${dataLinesCounter} records loaded.` );
					commitCounter = 0;
					await theMySqlDb.execSql ( 'commit' );
				}
			}
		}
		await theMySqlDb.execSql ( 'commit' );

		console.info ( `Loading of file ${fileName}. ended ${dataLinesCounter} records loaded.` );
	}

	/**
     * Coming soon...
     */

	async createTable ( ) {

		await theMySqlDb.execSql (
			'DROP TABLE if EXISTS ' + this.tableName + ';'
		);
		let createTableSqlString = 'CREATE TABLE IF NOT EXISTS `' + theConfig.dbName + '`.`' + this.tableName + '` (';
		this.fieldsMap.forEach (
			( value, key ) => createTableSqlString += '`' + key + '` ' +
			value.type + ( ( value.length ) ? '(' + value.length + '), ' : ', ' )
		);
		createTableSqlString = createTableSqlString.slice ( 0, createTableSqlString.length - 2 );
		createTableSqlString += ') DEFAULT CHARACTER SET utf8mb4  COLLATE utf8mb4_0900_ai_ci;';

		await theMySqlDb.execSql ( createTableSqlString );
		await this.createIndexes ( );
	}
}

export default TableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */