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

import theMySqlDb from './MySqlDb.js';
import FeedInfoTableLoader from './FeedInfoTableLoader.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon...
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class GtfsLoader {

	/**
     * The constructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
     * Start the upload of the gtsf
     */

	async start ( ) {
		await theMySqlDb.start ( );
		console.info ( '\nStarting gtfs2mysql ...\n\n' );
		await new FeedInfoTableLoader ( ).load ( );

		// await theMySqlDb.execSql ( 'commit' );
		await theMySqlDb.end ( );
		console.info ( 'GtfdLader.start () ) ended' );
	}

}

export default GtfsLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */