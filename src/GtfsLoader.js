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
import process from 'process';

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

		console.info ( '\nCreation of tables for PK started...\n\n' );

		await theMySqlDb.execSql (
			'DROP TABLE if EXISTS services_pk;'
		);
		await theMySqlDb.execSql (
			'CREATE TABLE services_pk ( ' +
				'service_pk int NOT NULL AUTO_INCREMENT, ' +
				'service_id varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs NOT NULL , ' +
				'PRIMARY KEY (service_pk) );'
		);
		await theMySqlDb.execSql (
			'create index ix_service_id on services_pk (service_id ); '
		);

		await theMySqlDb.execSql (
			'DROP TABLE if EXISTS shapes_pk;'
		);
		await theMySqlDb.execSql (
			'CREATE TABLE shapes_pk ( ' +
			'shape_pk int NOT NULL AUTO_INCREMENT, ' +
			'shape_id varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs  NOT NULL, ' +
			'PRIMARY KEY (shape_pk) );'
		);
		await theMySqlDb.execSql (
			'create index ix_shape_id on shapes_pk (shape_id ); '
		);

		console.info ( '\nCreation of tables for PK ended...\n\n' );
	}

	/**
     * Coming soon...
     */

	async #createViews ( ) {

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
				'route_pk as routePk, shape_pk as shapePk ' +
				'from ( ' +
					'select distinct calendar.start_date, calendar.end_date, ' +
					'routes.route_pk, trips.shape_pk ' +
					'FROM ' +
					'routes ' +
					'inner join trips on routes.route_pk = trips.route_pk ' +
					'inner join calendar on trips.service_pk = calendar.service_pk ' +
				') t ' +
				' group by shapePk order by minStartDate, maxEndDate;'
			);
		}
	}

	/**
     * Coming soon...
     */

	async #loadPk ( ) {
		console.info ( '\nLoading of PK started...\n\n' );

		// routes table
		console.info ( '\nfor routes...\n\n' );
		await theMySqlDb.execSql (
			'update routes set routes.agency_pk = ' +
			'( select agency.agency_pk from agency where agency.agency_id = routes.agency_id);'
		);

		// trips table
		console.info ( '\nfor trips...\n\n' );
		await theMySqlDb.execSql (
			'update trips set trips.route_pk = ' +
			'(select route_pk from routes where routes.route_id = trips.route_id);'
		);

		// stop_times table
		console.info ( '\nfor stop_times...\n\n' );
		await theMySqlDb.execSql (
			'update stop_times set stop_times.stop_pk = ' +
			'( select stop_pk from stops where stops.stop_id = stop_times.stop_id );'
		);
		await theMySqlDb.execSql (
			'update stop_times set stop_times.trip_pk = ' +
			'( select trip_pk from trips where trips.trip_id = stop_times.trip_id );'
		);

		// calendar table
		console.info ( '\nfor calendar...\n\n' );
		await theMySqlDb.execSql (
			'update calendar set calendar.service_pk = ' +
			'(select services_pk.service_pk from services_pk where services_pk.service_id = calendar.service_id );'
		);

		// calendar_dates table
		console.info ( '\nfor calendar_dates...\n\n' );
		await theMySqlDb.execSql (
			'update calendar_dates set calendar_dates.service_pk = ' +
			'(select services_pk.service_pk from services_pk where services_pk.service_id = calendar_dates.service_id );'
		);

		// shapes table
		console.info ( '\nfor shapes...\n\n' );
		await theMySqlDb.execSql (
			'update shapes set shapes.shape_pk = ' +
			'(select shapes_pk.shape_pk from shapes_pk where shapes_pk.shape_id = shapes.shape_id );'
		);

		// trips table
		console.info ( '\nfor trips...\n\n' );
		await theMySqlDb.execSql (
			'update trips set trips.service_pk = ' +
			'(select services_pk.service_pk from services_pk where services_pk.service_id = trips.service_id );'
		);
		await theMySqlDb.execSql (
			'update trips set trips.shape_pk = ' +
			'(select shapes_pk .shape_pk from shapes_pk where shapes_pk.shape_id = trips.shape_id );'
		);

		console.info ( '\nLoading of PK ended...\n\n' );
	}

	/**
     * Coming soon...
     */

	async #loadTablesPk ( ) {

		console.info ( '\nLoading of tables PK started...\n\n' );

		await theMySqlDb.execSql (
			'insert into services_pk (service_id ) select distinct service_id from ( ' +
				'select trips.service_id from trips union ' +
				'select calendar.service_id from calendar union ' +
				'select calendar_dates.service_id from calendar_dates ' +
			') t order by service_id;'
		);

		await theMySqlDb.execSql (
			'insert into shapes_pk (shape_id) select DISTINCT shape_id from shapes;'
		);
		console.info ( '\nLoading of tables PK ended...\n\n' );
	}

	/**
     * Start the upload of the gtsf
     */

	// eslint-disable-next-line max-statements
	async start ( ) {
		const startTime = process.hrtime.bigint ( );

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

		await this.#loadPk ( );

		await theMySqlDb.execSql ( 'DROP TABLE `services_pk`, `shapes_pk`;' );

		await theMySqlDb.end ( );

		// end of the process
		const deltaTime = process.hrtime.bigint ( ) - startTime;

		/* eslint-disable-next-line no-magic-numbers */
		const execTime = String ( deltaTime / 1000000000n ) + '.' + String ( deltaTime % 1000000000n ).substring ( 0, 3 );

		console.error ( `\nFiles generated in ${execTime} seconds.` );

		console.info ( '\ngtfs2mysql ended...\n\n' );
	}
}

export default GtfsLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */