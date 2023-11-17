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
import AgencyTableLoader from './AgencyTableLoader.js';
import ShapesTableLoader from './ShapesTableLoader.js';
import CalendarDatesTableLoader from './CalendarDatesTableLoader.js';
import CalendarTableLoader from './CalendarTableLoader.js';
import RouteTableLoader from './RoutesTableLoader.js';
import StopsTableLoader from './StopsTableLoader.js';
import TripsTableLoader from './TripsTableLoader.js';
import StopTimesTableLoader from './StopTimesTableLoader.js';

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
		console.info ( '\nStarting gtfs2mysql ...\n\n' );
		await theMySqlDb.start ( );

		await new AgencyTableLoader ( ).load ( );
		await new CalendarDatesTableLoader ( ).load ( );
		await new CalendarTableLoader ( ).load ( );
		await new FeedInfoTableLoader ( ).load ( );
		await new RouteTableLoader ( ).load ( );
		await new ShapesTableLoader ( ).load ( );
		await new StopsTableLoader ( ).load ( );
		await new StopTimesTableLoader ( ).load ( );
		await new TripsTableLoader ( ).load ( );
		await theMySqlDb.end ( );
		console.info ( '\ngtfs2mysql ended...\n\n' );
	}
}

export default GtfsLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */