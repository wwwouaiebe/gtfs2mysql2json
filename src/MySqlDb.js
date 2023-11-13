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

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

/**
 * Coming soon...
 */

class MySqlDb {

	/**
     * The user name
     * @type {string}
     */

	#userName;

	/**
     * The user password
     * @type {string}
     */

	#userPswd;

	/**
     * Ask the user name and pswd
     */

	async #askCredentials ( ) {
		console.clear ( );

		const readlineInterface = readline.createInterface ( { input, output } );

		readlineInterface.write ( 'What is your name?\n' );
		this.#userName = await readlineInterface.question ( '' );
		readlineInterface.write ( 'What is your pswd?\n' );
		this.#userPswd = await readlineInterface.question ( '\x1b[8;40m' );
		readlineInterface.close ( );

		console.clear ( );
		console.info ( '\x1b[0m' );
	}

	/**
     * The constructor
     */

	constructor ( ) {
		Object.freeze ( this );

	}

	/**
     * Start the db
	 */

	async start ( ) {
		await this.#askCredentials ( );
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * The one and only one instance of MySqlDb class.
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

const theMySqlDb = new MySqlDb;

export default theMySqlDb;

/* --- End of file --------------------------------------------------------------------------------------------------------- */