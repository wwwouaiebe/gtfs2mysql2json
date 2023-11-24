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

import TableLoader from './TableLoader.js';
import theMySqlDb from './MySqlDb.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon...
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class TripsTableLoader extends TableLoader {

	/**
     * Coming soon...
     * @type {string}
     */

	get tableName ( ) { return 'trips'; }

	/**
     * The cosntructor
     */

	constructor ( ) {
		super ( );
		this.fieldsMap.set (
			'route_id',
			{
				name : 'route_id',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'service_id',
			{
				name : 'service_id',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'trip_id',
			{
				name : 'trip_id',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'trip_headsign',
			{
				name : 'trip_headsign',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_256
			}
		);
		this.fieldsMap.set (
			'trip_short_name',
			{
				name : 'trip_short_name',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'direction_id',
			{
				name : 'direction_id',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'block_id',
			{
				name : 'block_id',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'shape_id',
			{
				name : 'shape_id',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'wheelchair_accessible',
			{
				name : 'wheelchair_accessible',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'bikes_allowed',
			{
				name : 'bikes_allowed',
				type : 'integer'
			}
		);
		Object.freeze ( this );
	}

	/**
     * Coming soon...
     */

	async createIndexes ( ) {
		await theMySqlDb.execSql (
			'create index ix_route_id on trips ( route_id );'
		);
		await theMySqlDb.execSql (
			'create index ix_service_id on trips ( service_id );'
		);
		await theMySqlDb.execSql (
			'create index ix_shape_id on trips ( shape_id );'
		);
		await theMySqlDb.execSql (
			'create index ix_trip_id on trips ( trip_id );'
		);

	}

}

export default TripsTableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */