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

class ShapesTableLoader extends TableLoader {

	/**
     * Coming soon...
     * @type {string}
     */

	get fileName ( ) { return 'shapes.txt'; }

	/**
     * Coming soon...
     * @type {string}
     */

	get tableName ( ) { return 'shapes'; }

	/**
     * The cosntructor
     */

	constructor ( ) {
		super ( );
		this.fieldsMap.set (
			'shape_id',
			{
				name : 'shape_id',
				type : 'varchar',
				length : TableLoader.VARCHAR_LENGHT_64
			}
		);
		this.fieldsMap.set (
			'shape_pt_lat',
			{
				name : 'shape_pt_lat',
				type : 'decimal',
				length : '9,6'
			}
		);
		this.fieldsMap.set (
			'shape_pt_lon',
			{
				name : 'shape_pt_lon',
				type : 'decimal',
				length : '9,6'
			}
		);
		this.fieldsMap.set (
			'shape_pt_sequence',
			{
				name : 'shape_pt_sequence',
				type : 'int'
			}
		);
		this.fieldsMap.set (
			'shape_dist_traveled',
			{
				name : 'shape_dist_traveled',
				type : 'float'
			}
		);
		Object.freeze ( this );
	}

}

export default ShapesTableLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */