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

class CalendarTableLoader extends TableLoader {

	/**
     * Coming soon...
     * @type {string}
     */

	get tableName ( ) { return 'calendar'; }

	/**
     * The cosntructor
     */

	constructor ( ) {
		super ( );
		this.fieldsMap.set (
			'service_id',
			{
				name : 'service_id',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'monday',
			{
				name : 'monday',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'tuesday',
			{
				name : 'tuesday',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'wednesday',
			{
				name : 'wednesday',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'thursday',
			{
				name : 'thursday',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'friday',
			{
				name : 'friday',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'saturday',
			{
				name : 'saturday',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'sunday',
			{
				name : 'sunday',
				type : 'integer'
			}
		);
		this.fieldsMap.set (
			'start_date',
			{
				name : 'start_date',
				type : 'date'
			}
		);
		this.fieldsMap.set (
			'end_date',
			{
				name : 'end_date',
				type : 'date'
			}
		);
		Object.freeze ( this );
	}

	/**
     * Coming soon...
     */

	async createIndexes ( ) {
		await theMySqlDb.execSql (
			'create index ix_service_id on calendar ( service_id );'
		);
	}

}

export default CalendarTableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */