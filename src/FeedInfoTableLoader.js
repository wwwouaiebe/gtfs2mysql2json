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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon...
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class FeedInfoTableLoader extends TableLoader {

	/**
     * Coming soon...
     * @type {string}
     */

	get fileName ( ) { return 'feed_info.txt'; }

	/**
     * Coming soon...
     * @type {string}
     */

	get tableName ( ) { return 'feed_info'; }

	/**
     * The cosntructor
     */

	constructor ( ) {
		super ( );
		this.fieldsMap.set (
			'feed_publisher_name',
			{
				name : 'feed_publisher_name',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'feed_publisher_url',
			{
				name : 'feed_publisher_url',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_256
			}
		);
		this.fieldsMap.set (
			'feed_lang',
			{
				name : 'feed_lang',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_5
			}
		);
		this.fieldsMap.set (
			'default_lang',
			{
				name : 'default_lang',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_5
			}
		);
		this.fieldsMap.set (
			'feed_start_date',
			{
				name : 'feed_start_date',
				type : 'date',
				length : -1
			}
		);
		this.fieldsMap.set (
			'feed_end_date',
			{
				name : 'feed_end_date',
				type : 'date',
				length : -1
			}
		);
		this.fieldsMap.set (
			'feed_version',
			{
				name : 'feed_version',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'feed_contact_email',
			{
				name : 'feed_contact_email',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_256
			}
		);
		this.fieldsMap.set (
			'feed_contact_url',
			{
				name : 'feed_contact_url',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_256
			}
		);
		Object.freeze ( this );
	}

}

export default FeedInfoTableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */