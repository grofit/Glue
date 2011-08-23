function Glue() {
	var instances = [];

	function KeyedBinding(key) {
	    var normalisedKey = key.toLowerCase();
	    this.To = function (instance) {
	        instances[normalisedKey] = instance;
	    };
    }
    
	this.Bind = function(key) {
		return new KeyedBinding(key);
	};

	this.Unbind = function (key) {
	    var normalisedKey = key.toLowerCase();
	    if (normalisedKey in instances) {
	        delete instances[normalisedKey];
	        return;
	    }
	    var errorMessage = "[" + normalisedKey + "] has not been registered";
	    throw errorMessage;
	};

    this.Get = function (key) {
        var normalisedKey = key.toLowerCase();
        if (normalisedKey in instances) {
            return instances[normalisedKey];
        }
        var errorMessage = "[" + normalisedKey + "] has not been registered";
        throw errorMessage;
    };

    this.HasBinding = function (key) {
        var normalisedKey = key.toLowerCase();
        return (normalisedKey in instances);
    };
}