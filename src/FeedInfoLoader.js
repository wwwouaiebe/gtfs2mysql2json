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

class FeedInfoLoader extends TableLoader {

	/**
     * The cosntructor
     */

	constructor ( ) {
		super ( );
		this.createTableSql = 'CREATE TABLE IF NOT EXISTS `gtfs02`.`feed_info` (' +
        '`feed_publisher_name` varchar(64),' +
        '`feed_publisher_url` varchar(256),' +
        '`feed_lang` varchar(5),' +
        '`default_lang` varchar(5),' +
        '`feed_start_date` date,' +
        '`feed_end_date` date,' +
        '`feed_version` varchar (64),' +
        '`feed_contact_email` varchar(256),' +
        '`feed_contact_url` varchar(256))' +
        ' DEFAULT CHARACTER SET utf8mb4  COLLATE utf8mb4_0900_ai_ci;';

		this.fileName = 'feed_info.txt';
		Object.freeze ( this );
	}
}

export default FeedInfoLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */