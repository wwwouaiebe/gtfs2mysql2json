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
import TranslationsTableLoader from './TranslationsTableLoader.js';
import theConfig from './Config.js';

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
     * Coming soon...
     */

	async #createTablesPk ( ) {

		await theMySqlDb.execSql (
			'DROP TABLE if EXISTS agencies_pk;'
		);
		await theMySqlDb.execSql (
			'CREATE TABLE agencies_pk ' +
			'( agency_pk int NOT NULL AUTO_INCREMENT, agency_id varchar(64) NOT NULL, PRIMARY KEY (agency_pk) );'
		);
		await theMySqlDb.execSql (
			'create index ix_agency_id on agencies_pk (agency_id ); '
		);

		await theMySqlDb.execSql (
			'DROP TABLE if EXISTS routes_pk;'
		);
		await theMySqlDb.execSql (
			'CREATE TABLE routes_pk ' +
			'( route_pk int NOT NULL AUTO_INCREMENT, route_id varchar(64) NOT NULL, PRIMARY KEY (route_pk) );'
		);
		await theMySqlDb.execSql (
			'create index ix_route_id on routes_pk (route_id );'
		);

		await theMySqlDb.execSql (
			'DROP TABLE if EXISTS shapes_pk;'
		);
		await theMySqlDb.execSql (
			'CREATE TABLE shapes_pk ' +
			'( shape_pk int NOT NULL AUTO_INCREMENT, shape_id varchar(64) NOT NULL, PRIMARY KEY (shape_pk) );'
		);
		await theMySqlDb.execSql (
			'create index ix_shape_id on shapes_pk (shape_id ); '
		);
	}

	/**
     * Coming soon...
     */

	async #createViews ( ) {

		await theMySqlDb.execSql (
			'create view routes_for_agency as ' +
			'select ' +
			'agencies_pk.agency_pk as agencyPk, routes_pk.route_pk as routePk, routes.route_short_name as routeShortName, ' +
			'routes.route_long_name as routeLongName ' +
			'FROM ' +
			'agencies_pk ' +
			'inner join routes on agencies_pk.agency_id = routes.agency_id ' +
			'inner join routes_pk on routes.route_id = routes_pk.route_id ' +
			'order by LPAD ( routes.route_short_name, 10, \' \');'
		);

		if ( 'gtfs_delijn' === theConfig.dbName ) {
			await theMySqlDb.execSql (
				'create view shapes_for_route as ' +
				'select min(start_date) as minStartDate, max(end_date) as maxEndDate, ' +
				'route_pk as routePk, shape_pk as shapePk, ' +
				'shape_id as shapeId ' +
				'from ' +
				'( ' +
				'select ' +
				'(select min(feed_start_date) from feed_info) as start_date , ' +
				'(select min(feed_end_date) from feed_info) as end_date, ' +
				'routes_pk.route_pk, shapes_pk.shape_pk, shapes_pk.shape_id FROM routes_pk ' +
				'inner join routes on routes_pk.route_id = routes.route_id ' +
				'inner join trips on routes.route_id = trips.route_id ' +
				'inner join shapes_pk on trips.shape_id = shapes_pk.shape_id ' +
				') t ' +
				'group by shapeId ;'
			);
		}
		else {
			await theMySqlDb.execSql (
				'create view shapes_for_route as ' +
				'select min(start_date) as minStartDate, max(end_date) as maxEndDate, ' +
				'route_pk as routePk, shape_pk as shapePk,' +
				'shape_id as shapeId ' +
				'from ' +
				'( ' +
				'select distinct calendar.start_date, calendar.end_date, ' +
				'routes_pk.route_pk, shapes_pk.shape_pk, shapes_pk.shape_id ' +
				'FROM routes_pk ' +
				'inner join routes on routes_pk.route_id = routes.route_id ' +
				'inner join trips on routes.route_id = trips.route_id ' +
				'inner join calendar on trips.service_id = calendar.service_id ' +
				' inner join shapes_pk on trips.shape_id = shapes_pk.shape_id ' +
				') t ' +
				'group by shapeId order by minStartDate, maxEndDate;'
			);
		}

		await theMySqlDb.execSql (
			'create view lat_lon_for_shape as ' +
			'select shape_pk as shapePk, shapes.shape_pt_lat as lat, shapes.shape_pt_lon as lon, ' +
			'shapes.shape_id as shapeId, shapes.shape_pt_sequence as sequence ' +
			'from shapes_pk inner join shapes on shapes_pk.shape_id = shapes.shape_id ' +
			'order by shapes.shape_id, shapes.shape_pt_sequence;'
		);
	}

	/**
     * Coming soon...
     */

	async #loadTablesPk ( ) {

		await theMySqlDb.execSql (
			'insert into agencies_pk (agency_id) select DISTINCT agency_id from agency;'
		);

		await theMySqlDb.execSql (
			'insert into routes_pk (route_id) select DISTINCT route_id from routes;'
		);

		await theMySqlDb.execSql (
			'insert into shapes_pk (shape_id) select DISTINCT shape_id from shapes;'
		);

	}

	/**
     * Start the upload of the gtsf
     */

	// eslint-disable-next-line max-statements
	async start ( ) {
		console.info ( '\nStarting gtfs2mysql ...\n\n' );
		await theMySqlDb.start ( );

		const agencyTableLoader = new AgencyTableLoader ( );
		const calendarDatesTableLoader = new CalendarDatesTableLoader ( );
		const calendarTableLoader = new CalendarTableLoader ( );
		const feedInfoTableLoader = new FeedInfoTableLoader ( );
		const routeTableLoader = new RouteTableLoader ( );
		const shapesTableLoader = new ShapesTableLoader ( );
		const stopsTableLoader = new StopsTableLoader ( );
		const stopTimesTableLoader = new StopTimesTableLoader ( );
		const translationsTableLoader = new TranslationsTableLoader ( );
		const tripsTableLoader = new TripsTableLoader ( );

		theMySqlDb.execSql (
			'DROP VIEW if exists lat_lon_for_shape, routes_for_agency, shapes_for_route;'
		);

		await agencyTableLoader.createTable ( );
		await calendarDatesTableLoader.createTable ( );
		await calendarTableLoader.createTable ( );
		await feedInfoTableLoader.createTable ( );
		await routeTableLoader.createTable ( );
		await shapesTableLoader.createTable ( );
		await stopsTableLoader.createTable ( );
		await stopTimesTableLoader.createTable ( );
		await translationsTableLoader.createTable ( );
		await tripsTableLoader.createTable ( );

		await this.#createTablesPk ( );

		await this.#createViews ( );

		await agencyTableLoader.loadData ( 'agency.txt' );
		await calendarDatesTableLoader.loadData ( 'calendar_dates.txt' );
		await calendarTableLoader.loadData ( 'calendar.txt' );
		await feedInfoTableLoader.loadData ( 'feed_info.txt' );
		await routeTableLoader.loadData ( 'routes.txt' );
		await shapesTableLoader.loadData ( 'shapes.txt' );
		await shapesTableLoader.loadData ( 'shapes1.txt' );
		await shapesTableLoader.loadData ( 'shapes2.txt' );
		await stopsTableLoader.loadData ( 'stops.txt' );
		await stopTimesTableLoader.loadData ( 'stop_times.txt' );
		await stopTimesTableLoader.loadData ( 'stop_times1.txt' );
		await stopTimesTableLoader.loadData ( 'stop_times2.txt' );
		await stopTimesTableLoader.loadData ( 'stop_times3.txt' );
		await stopTimesTableLoader.loadData ( 'stop_times4.txt' );
		await stopTimesTableLoader.loadData ( 'stop_times5.txt' );
		await stopTimesTableLoader.loadData ( 'stop_times6.txt' );
		await translationsTableLoader.loadData ( 'translations.txt' );
		await tripsTableLoader.loadData ( 'trips.txt' );

		await theMySqlDb.execSql (
			'update routes set agency_id = \'STIB-MIVB\' where agency_id is null;'
		);

		await this.#loadTablesPk ( );

		await theMySqlDb.end ( );
		console.info ( '\ngtfs2mysql ended...\n\n' );
	}
}

export default GtfsLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */