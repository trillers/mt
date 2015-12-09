var errorRegistry = require('./error-registry');

/**
 * Retrieve rich-descriptive error message from server api error
 * @param err error thrown from server.
 * @param apiName api method name or short desc of server api
 * @returns {string} rich-descriptive error message of server invocation
 */
var getErrorMessage = function(err, apiName){
    var apiNamePart = apiName ? apiName + ': ' : '';
    var errmsg =
        apiNamePart + err + ', code: ' + err.code +
        ', possible reason: ' + errorRegistry[''+err.code];
    return errmsg;
};

/**
 * Generate a rich-descriptive error object from the result of server api invocation.
 * @param result the returning result of server api invocation.
 * @param apiName method name or short desc of server api
 * @returns {Error} Error object if any, or null
 */
var getResultError = function(result, apiName){
    var err = null;
    if(result && typeof(result) == 'object' && result.errcode){
        var errormsg = getErrorMessage(result['errmsg'], apiName);
        err = new Error(errormsg);
        err.code = result['errcode'];
        err.message = result['errmsg'];
    }
    return err;
};

/**
 * Throw error retrieved from result if server api invocation fails
 * @param result the returning result of server api invocation.
 * @param apiName method name or short desc of server api
 */
var throwResultError = function(result, apiName){
    var err = getResultError(result, apiName);
    if(err){
        throw err;
    }
};

module.exports = {
    getErrorMessage: getErrorMessage,
    getResultError: getResultError,
    throwResultError: throwResultError
};
