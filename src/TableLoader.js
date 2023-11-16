import theConfig from './Config.js';
import fs from 'fs';
import theMySqlDb from './MySqlDb.js';

/**
 * Coming soon...
 */

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