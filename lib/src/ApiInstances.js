let ApisInstance = require("./ApisInstance");

let inst;

/**
 Configure: configure as follows `Apis.instance("ws://localhost:8090").init_promise`.  This returns a promise, once resolved the connection is ready.
 
 Import: import { Apis } from "@graphene/chain"
 
 Short-hand: Apis.db("method", "parm1", 2, 3, ...).  Returns a promise with results.
 
 Additional usage: Apis.instance().db_api().exec("method", ["method", "parm1", 2, 3, ...]).  Returns a promise with results.
 */

module.exports = {
	
	setRpcConnectionStatusCallback: function(callback) {
		this.statusCb = callback;
		if(inst) inst.setRpcConnectionStatusCallback(callback);
	},
	
	/**
	 @arg {string} cs is only provided in the first call
	 @return {Apis} singleton .. Check Apis.instance().init_promise to know when the connection is established
	 */
	reset: function(cs = "ws://localhost:8090", connect, user, password, autoReconnect) {
		if(inst) {
			inst.close();
			inst = null;
		}
		inst = new ApisInstance();
		inst.setRpcConnectionStatusCallback(this.statusCb);
		
		if(inst && connect) {
			inst.connect(cs, user, password, autoReconnect);
		}
		
		return inst;
	},
	instance: function(cs = "ws://localhost:8090", connect, user, password, autoReconnect) {
		if(!inst) {
			inst = new ApisInstance();
			inst.setRpcConnectionStatusCallback(this.statusCb);
		}
		
		if(inst && connect) {
			inst.connect(cs, user, password, autoReconnect);
		}
		
		return inst;
	},
	chainId: () => Apis.instance().chain_id,
	
	close: () => {
		if(inst) {
			inst.close();
			inst = null;
		}
	}
	// db: (method, ...args) => Apis.instance().db_api().exec(method, toStrings(args)),
	// network: (method, ...args) => Apis.instance().network_api().exec(method, toStrings(args)),
	// history: (method, ...args) => Apis.instance().history_api().exec(method, toStrings(args)),
	// crypto: (method, ...args) => Apis.instance().crypto_api().exec(method, toStrings(args))
};