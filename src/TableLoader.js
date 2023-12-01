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
	 * Coming soom...
	 * @type {String}
	 */

	#remainingData = '';

	/**
	 * Coming soom...
	 * @type {String}
	 */

	#dataLinesCounter;

	/**
	 * Coming soom...
	 * @type {String}
	 */

	#insertSqlStringHeader;

	/**
     * Coming soon...
     * @type {number}
     */

	// eslint-disable-next-line no-magic-numbers
	static get VARCHAR_LENGHT_10 ( ) { return 10; }

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
     * @type {number}
     */

	// eslint-disable-next-line no-magic-numbers
	static get HIGH_WATER_MARK () { return 2097152; }

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
		Object.freeze ( this );
	}

	/**
	 * Coming soon...
	 * @param {String} dataLine Coming soon...
	 */

	#getFieldsValues ( dataLine ) {
		let tmpFieldsValues = dataLine.split ( '"' );
		let tmpDataLine = '';
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
     * @param {string} dataLine
     * @returns {string} the header of the sql
     */

	#setInsertSqlStringHeader ( dataLine ) {
		let fields = dataLine.split ( ',' );
		this.#insertSqlStringHeader = ' INSERT INTO `' + theConfig.dbName + '`.`' + this.tableName + '` (';
		fields.forEach (
			field => {
				this.#insertSqlStringHeader += '`' + field + '`, ';
				this.#fieldsList.push ( field );
			}
		);
		this.#insertSqlStringHeader = this.#insertSqlStringHeader.slice ( 0, this.#insertSqlStringHeader.length - 2 );
		this.#insertSqlStringHeader += ') VALUES (';
	}

	/**
     * Coming soon...
	 * @param {String} dataLine Comming soon...
      */

	async #processData ( dataLine ) {
		// eslint-disable-next-line no-empty
		if ( ! dataLine || '' === dataLine ) {
			return;
		}

		// first line contains the fields names
		if ( '' === this.#insertSqlStringHeader ) {
			this.#setInsertSqlStringHeader ( dataLine.replaceAll ( '"', '' ) );
			return;
		}

		this.#dataLinesCounter ++;

		// line is splited into fields values
		let fieldValues = this.#getFieldsValues ( dataLine );
		let fieldCounter = 0;
		let insertSqlString = this.#insertSqlStringHeader;
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

		await theMySqlDb.execSql ( insertSqlString );
	}

	/**
     * Coming soon...
	 * @param {String} partialData Comming soon...
      */

	async #loadPartialData ( partialData ) {
		let dataArray = partialData.split ( /\r\n|\r|\n/ );
		dataArray [ 0 ] = this.#remainingData + dataArray [ 0 ];
		this.#remainingData = dataArray.pop ( );

		for ( let dataCounter = 0; dataCounter < dataArray.length; dataCounter ++ ) {
			await this.#processData ( dataArray [ dataCounter ] );
		}

		await theMySqlDb.execSql ( 'commit;' );

		console.info ( `${this.#dataLinesCounter} records loaded` );
	}

	/**
     * Coming soon...
	 * @param {String} fileName Comming soon...
      */

	async loadData ( fileName ) {

		this.#dataLinesCounter = 0;
		this.#insertSqlStringHeader = '';
		this.#remainingData = '';

		try {
			fs.accessSync ( theConfig.srcDir + '/' + fileName );
		}
		catch ( err ) {
			console.info ( `\nFile ${fileName} not found` );
			return;
		}

		console.info ( `\nLoading of file ${fileName} started` );

		let readableStream = fs.createReadStream (
			theConfig.srcDir + '/' + fileName,
			{
				encoding : 'utf8',
				highWaterMark : TableLoader.HIGH_WATER_MARK
			}
		);

		await readableStream.forEach (
			async data => await this.#loadPartialData ( data )
		);

		console.info ( `\nLoading of file ${fileName}. ended ${this.#dataLinesCounter} records loaded.` );

	}

	/**
     * Coming soon...
     */

	async createTable ( ) {

		await theMySqlDb.execSql (
			'DROP TABLE if EXISTS ' + this.tableName + ';'
		);
		let createTableSqlString = 'CREATE TABLE IF NOT EXISTS `' + theConfig.dbName + '`.`' + this.tableName + '` (';
		let indexesString = '';
		let primaryKey = null;
		this.fieldsMap.forEach (
			value => {
				createTableSqlString += '`' + value.name +
					'` ' + value.type + ( ( value.length ) ? '(' + value.length + ') ' : ' ' ) +
					( value.primary ? ' NOT NULL AUTO_INCREMENT' : '' ) +
					( value.collate ? ' CHARACTER SET utf8mb4 COLLATE ' + value.collate : '' ) +
					' ,';
				if ( value.index ) {
					indexesString += 'INDEX `ix_' + value.name + '` (`' + value.name + '`) ,';
				}
				if ( value.primary ) {
					primaryKey = value;
				}
			}
		);
		if ( primaryKey ) {
			createTableSqlString += 'PRIMARY KEY ( `' + primaryKey.name + '`) ,';
		}
		createTableSqlString += indexesString;
		createTableSqlString = createTableSqlString.slice ( 0, createTableSqlString.length - 2 );
		createTableSqlString += ') DEFAULT CHARACTER SET utf8mb4  COLLATE utf8mb4_0900_ai_ci;';

		await theMySqlDb.execSql ( createTableSqlString );

		await this.createIndexes ( );
		console.info ( `\nTable ${this.tableName} created` );
	}
}

export default TableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */