import theConfig from './Config.js';

class Operator {

	#jsonOperator = {};

	get mySqlDbName ( ) { return this.#jsonOperator.mySqlDbName; }

	get gtfsDirectory ( ) { return this.#jsonOperator.gtfsDirectory; }

	get operator ( ) { return this.#jsonOperator.operator; }

	get osmOperator ( ) { return this.#jsonOperator.osmOperator; }

	get networks ( ) { return this.#jsonOperator.networks; }

	async loadData ( ) {
		const jsonOperator = await import (
			'../operators/' + theConfig.operatorFile,
			{ assert : { type : 'json' } }
		);
		this.#jsonOperator = jsonOperator.default;
	}

	constructor ( ) {
		Object.freeze ( this );
	}

}

const theOperator = new Operator ( );

export default theOperator;