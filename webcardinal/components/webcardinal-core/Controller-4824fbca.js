import { aj as getTranslationsFromState, ak as getSkinFromState, V as VIEW_MODEL_KEY, d as MODEL_CHAIN_PREFIX, i as TAG_ATTRIBUTE, j as TAG_MODEL_FUNCTION_PROPERTY, P as PAGES_PATH, af as URLHelper } from './index-8ae4b65b.js';
import './index.esm.js';

bindableModelRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t);}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"D:\\privatesky\\builds\\tmp\\bindableModel.js":[function(require,module,exports){
(function (global){(function (){
if (typeof window !== "undefined" && typeof window.process === "undefined") {
	window.process = {};
}

if (typeof File === "undefined") {
	global.File = function (){};
}

require("./bindableModel_intermediar");

}).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

},{"./bindableModel_intermediar":"D:\\privatesky\\builds\\tmp\\bindableModel_intermediar.js"}],"D:\\privatesky\\builds\\tmp\\bindableModel_intermediar.js":[function(require,module,exports){
(function (global){(function (){
global.bindableModelLoadModules = function(){

	if(typeof $$.__runtimeModules["overwrite-require"] === "undefined"){
		$$.__runtimeModules["overwrite-require"] = require("overwrite-require");
	}

	if(typeof $$.__runtimeModules["queue"] === "undefined"){
		$$.__runtimeModules["queue"] = require("queue");
	}

	if(typeof $$.__runtimeModules["soundpubsub"] === "undefined"){
		$$.__runtimeModules["soundpubsub"] = require("soundpubsub");
	}

	if(typeof $$.__runtimeModules["psk-bindable-model"] === "undefined"){
		$$.__runtimeModules["psk-bindable-model"] = require("psk-bindable-model");
	}
};
if (false) {
	bindableModelLoadModules();
}
global.bindableModelRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("bindableModel");
}

}).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

},{"overwrite-require":"overwrite-require","psk-bindable-model":"psk-bindable-model","queue":"queue","soundpubsub":"soundpubsub"}],"D:\\privatesky\\modules\\overwrite-require\\moduleConstants.js":[function(require,module,exports){
module.exports = {
  BROWSER_ENVIRONMENT_TYPE: 'browser',
  MOBILE_BROWSER_ENVIRONMENT_TYPE: 'mobile-browser',
  WEB_WORKER_ENVIRONMENT_TYPE: 'web-worker',
  SERVICE_WORKER_ENVIRONMENT_TYPE: 'service-worker',
  ISOLATE_ENVIRONMENT_TYPE: 'isolate',
  THREAD_ENVIRONMENT_TYPE: 'thread',
  NODEJS_ENVIRONMENT_TYPE: 'nodejs'
};

},{}],"D:\\privatesky\\modules\\overwrite-require\\standardGlobalSymbols.js":[function(require,module,exports){
(function (global){(function (){
let logger = console;

if(typeof $$.Buffer === "undefined"){
    $$.Buffer = require("buffer").Buffer;
}

if (typeof global.$$.uidGenerator == "undefined") {
    $$.uidGenerator = {};
    $$.uidGenerator.safe_uuid = require("swarmutils").safe_uuid;
}

if (!global.process || process.env.NO_LOGS !== 'true') {
    try {
        const zmqName = "zeromq";
        require(zmqName);
        const PSKLoggerModule = require('psklogger');
        const PSKLogger = PSKLoggerModule.PSKLogger;

        logger = PSKLogger.getLogger();

        console.log('Logger init successful', process.pid);
    } catch (e) {
        if(e.message.indexOf("psklogger")!==-1 || e.message.indexOf("zeromq")!==-1){
            console.log('Logger not available, using console');
            logger = console;
        }else {
            console.log(e);
        }
    }
} else {
    console.log('Environment flag NO_LOGS is set, logging to console');
}

$$.registerGlobalSymbol = function (newSymbol, value) {
    if (typeof $$[newSymbol] == "undefined") {
        Object.defineProperty($$, newSymbol, {
            value: value,
            writable: false
        });
    } else {
        logger.error("Refusing to overwrite $$." + newSymbol);
    }
};

console.warn = (...args)=>{
    console.log(...args);
};

/**
 * @method
 * @name $$#autoThrow
 * @param {Error} err
 * @throws {Error}
 */

$$.registerGlobalSymbol("autoThrow", function (err) {
    if (!err) {
        throw err;
    }
});

/**
 * @method
 * @name $$#propagateError
 * @param {Error} err
 * @param {function} callback
 */
$$.registerGlobalSymbol("propagateError", function (err, callback) {
    if (err) {
        callback(err);
        throw err; //stop execution
    }
});

/**
 * @method
 * @name $$#logError
 * @param {Error} err
 */
$$.registerGlobalSymbol("logError", function (err) {
    if (err) {
        console.log(err);
        $$.err(err);
    }
});

/**
 * @method
 * @name $$#fixMe
 * @param {...*} args
 */

$$.registerGlobalSymbol("fixMe", function (...args) {
    console.log("Fix this:", ...args);
});

/**
 * @method - Throws an error
 * @name $$#exception
 * @param {string} message
 * @param {*} type
 */
$$.registerGlobalSymbol("exception", function (message, type) {
    throw new Error(message);
});

/**
 * @method - Throws an error
 * @name $$#throw
 * @param {string} message
 * @param {*} type
 */
$$.registerGlobalSymbol("throw", function (message, type) {
    throw new Error(message);
});


/**
 * @method - Warns that method is not implemented
 * @name $$#incomplete
 * @param {...*} args
 */
/* signal a  planned feature but not implemented yet (during development) but
also it could remain in production and should be flagged asap*/
$$.incomplete = function (...args) {
    args.unshift("Incomplete feature touched:");
    logger.warn(...args);
};

/**
 * @method - Warns that method is not implemented
 * @name $$#notImplemented
 * @param {...*} args
 */
$$.notImplemented = $$.incomplete;


/**
 * @method Throws if value is false
 * @name $$#assert
 * @param {boolean} value - Value to assert against
 * @param {string} explainWhy - Reason why assert failed (why value is false)
 */
/* used during development and when trying to discover elusive errors*/
$$.registerGlobalSymbol("assert", function (value, explainWhy) {
    if (!value) {
        throw new Error("Assert false " + explainWhy);
    }
});

/**
 * @method
 * @name $$#flags
 * @param {string} flagName
 * @param {*} value
 */
/* enable/disabale flags that control psk behaviour*/
$$.registerGlobalSymbol("flags", function (flagName, value) {
    $$.incomplete("flags handling not implemented");
});

/**
 * @method - Warns that a method is obsolete
 * @name $$#obsolete
 * @param {...*} args
 */
$$.registerGlobalSymbol("obsolete", function (...args) {
    args.unshift("Obsolete feature:");
    logger.log(...args);
    console.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "log"
 * @name $$#log
 * @param {...*} args
 */
$$.registerGlobalSymbol("log", function (...args) {
    args.unshift("Log:");
    logger.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "info"
 * @name $$#info
 * @param {...*} args
 */
$$.registerGlobalSymbol("info", function (...args) {
    args.unshift("Info:");
    logger.log(...args);
    console.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "error"
 * @name $$#err
 * @param {...*} args
 */
$$.registerGlobalSymbol("err", function (...args) {
    args.unshift("Error:");
    logger.error(...args);
    console.error(...args);
});

/**
 * @method - Uses the logger to log a message of level "error"
 * @name $$#err
 * @param {...*} args
 */
$$.registerGlobalSymbol("error", function (...args) {
    args.unshift("Error:");
    logger.error(...args);
    console.error(...args);
});

/**
 * @method - Uses the logger to log a message of level "warning"
 * @name $$#warn
 * @param {...*} args
 */
$$.registerGlobalSymbol("warn", function (...args) {
    args.unshift("Warn:");
    logger.warn(...args);
    console.log(...args);
});

/**
 * @method - Uses the logger to log a message of level "syntexError"
 * @name $$#syntexError
 * @param {...*} args
 */
$$.registerGlobalSymbol("syntaxError", function (...args) {
    args.unshift("Syntax error:");
    logger.error(...args);
    try{
        throw new Error("Syntax error or misspelled symbol!");
    }catch(err){
        console.error(...args);
        console.error(err.stack);
    }

});

/**
 * @method - Logs an invalid member name for a swarm
 * @name $$#invalidMemberName
 * @param {string} name
 * @param {Object} swarm
 */
$$.invalidMemberName = function (name, swarm) {
    let swarmName = "unknown";
    if (swarm && swarm.meta) {
        swarmName = swarm.meta.swarmTypeName;
    }
    const text = "Invalid member name " + name + "in swarm " + swarmName;
    console.error(text);
    logger.err(text);
};

/**
 * @method - Logs an invalid swarm name
 * @name $$#invalidSwarmName
 * @param {string} name
 * @param {Object} swarm
 */
$$.registerGlobalSymbol("invalidSwarmName", function (swarmName) {
    const text = "Invalid swarm name " + swarmName;
    console.error(text);
    logger.err(text);
});

/**
 * @method - Logs unknown exceptions
 * @name $$#unknownException
 * @param {...*} args
 */
$$.registerGlobalSymbol("unknownException", function (...args) {
    args.unshift("unknownException:");
    logger.err(...args);
    console.error(...args);
});

/**
 * @method - PrivateSky event, used by monitoring and statistics
 * @name $$#event
 * @param {string} event
 * @param {...*} args
 */
$$.registerGlobalSymbol("event", function (event, ...args) {
    if (logger.hasOwnProperty('event')) {
        logger.event(event, ...args);
    } else {
        if(event === "status.domains.boot"){
            console.log("Failing to console...", event, ...args);
        }
    }
});

/**
 * @method -
 * @name $$#redirectLog
 * @param {string} event
 * @param {...*} args
 */
$$.registerGlobalSymbol("redirectLog", function (logType, logObject) {
    if(logger.hasOwnProperty('redirect')) {
        logger.redirect(logType, logObject);
    }
});

/**
 * @method - log throttling event // it is just an event?
 * @name $$#throttlingEvent
 * @param {...*} args
 */
$$.registerGlobalSymbol("throttlingEvent", function (...args) {
    logger.log(...args);
});

}).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

},{"buffer":false,"psklogger":false,"swarmutils":false}],"D:\\privatesky\\modules\\psk-bindable-model\\lib\\PskBindableModel.js":[function(require,module,exports){
const SoundPubSub = require("soundpubsub").soundPubSub;
const CHAIN_CHANGED = 'chainChanged';
const WILDCARD = "*";
const CHAIN_SEPARATOR = ".";
const MODEL_PREFIX = "Model";
const ARRAY_CHANGE_METHODS = ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'slice', 'sort', 'splice', 'unshift'];
const compactor = function(message, channel) {
    if (message.type === CHAIN_CHANGED) {
        return channel;
    }
};
SoundPubSub.registerCompactor(CHAIN_CHANGED, compactor);

let modelCounter = 0;

class PskBindableModel {

    static setModel(_model) {
        let root = undefined;
        let targetPrefix = MODEL_PREFIX + CHAIN_SEPARATOR + modelCounter + CHAIN_SEPARATOR;
        let observedChains = new Set();
        let referencedChangeCallbacks = [];
        const expressions = {};

        modelCounter++;

        function extendChain(parentChain, currentChain) {
            return parentChain ? parentChain + CHAIN_SEPARATOR + currentChain : currentChain
        }

        function createChannelName(chain) {
            return targetPrefix + chain;
        }

        function makeSetter(parentChain) {
            return function(obj, prop, value) {
                let chain = extendChain(parentChain, prop);
                if (value && typeof value === "object") {
                    obj[prop] = proxify(value, chain);
                } else {
                    obj[prop] = value;
                }
                root.notify(chain);
                return true;
            }
        }

        function pushHandler(target, parentChain) {
            return function(...args) {
                try {
                    let arrayLength = Array.prototype.push.apply(target, args);

                    // we need to proxify the newly added elements
                    for (let index = arrayLength - args.length; index < arrayLength; index++) {
                        target[index] = proxify(target[index], extendChain(parentChain, index.toString()));
                    }

                    let index = arrayLength - 1;
                    root.notify(extendChain(parentChain, index));
                    return arrayLength;
                } catch (e) {
                    console.log("An error occurred in Proxy");
                    throw e;
                }
            }
        }

        function arrayFnHandler(fn, target, parentChain) {
            return function(...args) {
                try {
                    const isArrayChangingMethod = ARRAY_CHANGE_METHODS.indexOf(fn) !== -1;

                    if(isArrayChangingMethod) {
                        // we need to convert each proxified element of the array, since the elements can have their position changed
                        target.forEach((element, index) => {
                            if(typeof target[index] === "object") {
                                target[index] = root.toObject(extendChain(parentChain, index.toString()));
                            }
                        });
                    }

                    let returnedValue = Array.prototype[fn].apply(target, args);

                    if(isArrayChangingMethod) {
                        // we need to proxify all the elements again
                        for (let index = 0; index < target.length; index++) {
                            target[index] = proxify(target[index], extendChain(parentChain, index.toString()));
                        }
                    }

                    if (isArrayChangingMethod) {
                        root.notify(parentChain);
                    }
                    return returnedValue;
                } catch (e) {
                    console.log("An error occurred in Proxy");
                    throw e;
                }
            }
        }


        function proxify(obj, parentChain) {

            if (typeof obj !== "object" || obj instanceof File) {
                return obj;
            }

            let isRoot = !parentChain;
            let notify, onChange,offChange, getChainValue, setChainValue, cleanReferencedChangeCallbacks;
            if (isRoot) {
                notify = function(changedChain) {

                    function getRelatedChains(changedChain) {
                        if (typeof changedChain !== 'string') {
                            changedChain = `${changedChain}`;
                        }
                        let chainsRelatedSet = new Set();
                        chainsRelatedSet.add(WILDCARD);
                        let chainSequence = changedChain.split(CHAIN_SEPARATOR).map(el => el.trim());

                        let chainPrefix = "";
                        for (let i = 0; i < chainSequence.length; i++) {
                            if (i !== 0) {
                                chainPrefix += CHAIN_SEPARATOR + chainSequence[i];
                            } else {
                                chainPrefix = chainSequence[i];
                            }
                            chainsRelatedSet.add(chainPrefix);
                        }

                        observedChains.forEach((chain) => {
                            if (chain.startsWith(changedChain)) {
                                chainsRelatedSet.add(chain);
                            }
                        });

                        return chainsRelatedSet;
                    }

                    let changedChains = getRelatedChains(changedChain);

                    changedChains.forEach(chain => {
                        SoundPubSub.publish(createChannelName(chain), {
                            type: CHAIN_CHANGED,
                            chain: chain,
                            targetChain: changedChain
                        });
                    });
                };

                getChainValue = function(chain) {

                    if (!chain) {
                        return root;
                    }

                    let chainSequence = chain.split(CHAIN_SEPARATOR).map(el => el.trim());
                    let reducer = (accumulator, currentValue) => {
                        if (accumulator !== null && typeof accumulator !== 'undefined') {
                            return accumulator[currentValue];
                        }
                        return undefined;
                    };
                    return chainSequence.reduce(reducer, root);
                };

                setChainValue = function(chain, value) {
                    let chainSequence = chain.split(CHAIN_SEPARATOR).map(el => el.trim());

                    let reducer = (accumulator, currentValue, index, array) => {
                        if (accumulator !== null && typeof accumulator !== 'undefined') {
                            if (index === array.length - 1) {
                                accumulator[currentValue] = value;
                                return true;
                            }
                            accumulator = accumulator[currentValue];
                            return accumulator;
                        }
                        return undefined;
                    };
                    return chainSequence.reduce(reducer, root);
                };

                onChange = function(chain, callback) {
                    observedChains.add(chain);
                    SoundPubSub.subscribe(createChannelName(chain), callback);
                    referencedChangeCallbacks.push({chain:chain, callback:callback});
                };

                offChange = function (chain, callback){
                    if (observedChains.has(chain)) {
                        let index = referencedChangeCallbacks.findIndex(referenceChangeCallback => {
                            return referenceChangeCallback.callback === callback
                        });
                        if (index !== -1) {
                            referencedChangeCallbacks.splice(index, 1);
                        }
                        SoundPubSub.unsubscribe(createChannelName(chain), callback);
                    }
                };
                cleanReferencedChangeCallbacks = function () {
                    for (let i = 0; i < referencedChangeCallbacks.length; i++) {
                        let {chain, callback} = referencedChangeCallbacks[i];
                        offChange.call(this, chain, callback);
                    }
                };
            }

            function makeArrayGetter(parentChain) {
                const PROXY_ROOT_METHODS = [
                    "toObject",
                    "addExpression",
                    "evaluateExpression",
                    "hasExpression",
                    "onChangeExpressionChain",
                    "offChangeExpressionChain"
                ];
                return function(target, prop) {
                    if (isRoot) {
                        switch (prop) {
                            case "onChange":
                                return onChange;
                            case "offChange":
                                return offChange;
                            case "notify":
                                return notify;
                            case "getChainValue":
                                return getChainValue;
                            case "setChainValue":
                                return setChainValue;
                            case "cleanReferencedChangeCallbacks":
                                return cleanReferencedChangeCallbacks;
                            default:
                                if(PROXY_ROOT_METHODS.includes(prop)) {
                                    return target[prop];
                                }
                        }
                    }

                    if (prop === "__isProxy") {
                        return true;
                    }

                    const val = target[prop];
                    if (typeof val === 'function') {
                        switch (prop) {
                            case "push":
                                return pushHandler(target, parentChain);
                            default:
                                return arrayFnHandler(prop, target, parentChain);
                        }
                    }
                    return val;
                }
            }

            let setter = makeSetter(parentChain);

            let handler = {
                apply: function(target, prop, argumentsList) {
                    throw new Error("A function call was not expected inside proxy!");
                },
                constructor: function(target, args) {
                    throw new Error("A constructor call was not expected inside proxy!");
                },
                isExtensible: function(target) {
                    return Reflect.isExtensible(target);
                },
                preventExtensions: function(target) {
                    return Reflect.preventExtensions(target);
                },
                get: function(obj, prop) {
                    if (isRoot) {
                        switch (prop) {
                            case "onChange":
                                return onChange;
                            case "offChange":
                                return offChange;
                            case "notify":
                                return notify;
                            case "getChainValue":
                                return getChainValue;
                            case "setChainValue":
                                return setChainValue;
                            case "cleanReferencedChangeCallbacks":
                                return cleanReferencedChangeCallbacks;
                        }
                    }

                    if (prop === "__isProxy") {
                        return true;
                    }

                    if(obj instanceof Promise && typeof obj[prop] === "function") {
                        return obj[prop].bind(obj);
                    }

                    return obj[prop];
                },
                set: makeSetter(parentChain),

                deleteProperty: function(oTarget, sKey) {
                    if (sKey in oTarget){
                        delete oTarget[sKey];
                        return true;
                    }
                    return false
                },

                ownKeys: function(oTarget) {
                    return Reflect.ownKeys(oTarget);
                },
                has: function(oTarget, sKey) {
                    return sKey in oTarget
                },
                defineProperty: function(oTarget, sKey, oDesc) {
                    let oDescClone = Object.assign({}, oDesc);
                    oDescClone.set = function(obj, prop, value) {
                        if (oDesc.hasOwnProperty("set")) {
                            oDesc.set(obj, prop, value);
                        }
                        setter(obj, prop, value);
                    };
                    return Object.defineProperty(oTarget, sKey, oDescClone);
                },
                getOwnPropertyDescriptor: function(oTarget, sKey) {
                    return Object.getOwnPropertyDescriptor(oTarget, sKey)
                },
                getPrototypeOf: function(target) {
                    return Reflect.getPrototypeOf(target)
                },
                setPrototypeOf: function(target, newProto) {
                    Reflect.setPrototypeOf(target, newProto);
                }
            };

            if (Array.isArray(obj)) {
                handler.get = makeArrayGetter(parentChain || "");
            }

            //proxify inner objects
            Object.keys(obj).forEach(prop => {
                if (obj[prop]) {
                    obj[prop] = proxify(obj[prop], extendChain(parentChain, prop));
                }
            });

            if(obj.__isProxy) {
                return obj;
            }

            return new Proxy(obj, handler);
        }

        root = proxify(_model);

        /**
         * This function is returning the object representanion of the proxified model.
         * It accepts only one optional parameter, chain.
         * If no chain is provided, the root model becomes the source.
         *
         * @param {string | null} chain - (Optional) The chain inside the root model.
         * @returns {Object} - The object representanion of the proxified model
         */
        root.toObject = function(chain) {
            let source = {};

            if (!chain) {
                source = root;
            } else if (typeof chain === 'string') {
                source = root.getChainValue(chain);
            }

            if (source && typeof source === 'object') {
                return JSON.parse(JSON.stringify(source));
            }

            return source;
        };

        ////////////////////////////
        // Model expressions support
        ////////////////////////////
        /**
         * @param {string} expressionName
         * @param {callback} callback
         * @param {...string} var_args Variable number of chains to watch. First argument can be an array of chains
         * @throws {Error}
         */
        root.addExpression = function(expressionName, callback, ...args) {
            if (typeof expressionName !== 'string' || !expressionName.length) {
                throw new Error("Expression name must be a valid string");
            }

            if (typeof callback !== 'function') {
                throw new Error("Expression must have a callback");
            }

            let watchChain = [];
            if (args.length) {
                let chainList = args;

                if (Array.isArray(chainList[0])) {
                    chainList = chainList[0];
                }

                watchChain = chainList.filter((chain) => {
                    return typeof chain === 'string' && chain.length;
                });
            }

            expressions[expressionName] = {
                watchChain,
                callback: function() {
                    return callback.call(root);
                }
            };
        };

        /**
         * @param {string} expressionName
         * @return {mixed}
         * @throws {Error}
         */
        root.evaluateExpression = function(expressionName) {
            if (!this.hasExpression(expressionName)) {
                throw new Error(`Expression "${expressionName}" is not defined`);
            }

            return expressions[expressionName].callback();
        };

        /**
         * @param {string} expressionName
         * @return {boolean}
         */
        root.hasExpression = function(expressionName) {
            if (typeof expressions[expressionName] === 'object' &&
                typeof expressions[expressionName].callback === 'function') {
                return true;
            }
            return false;
        };

        /**
         * Watch expression chains
         *
         * @param {string} expressionName
         * @param {callback} callback
         */
        root.onChangeExpressionChain = function(expressionName, callback) {
            if (!this.hasExpression(expressionName)) {
                throw new Error(`Expression "${expressionName}" is not defined`);
            }

            const expr = expressions[expressionName];

            if (!expr.watchChain.length) {
                return;
            }

            for (let i = 0; i < expr.watchChain.length; i++) {
                this.onChange(expr.watchChain[i], callback);
            }
        };
        root.offChangeExpressionChain = function(expressionName, callback) {
            if (!this.hasExpression(expressionName)) {
                return;
            }
            const expr = expressions[expressionName];
            if (!expr.watchChain.length) {
                return;
            }

            for (let i = 0; i < expr.watchChain.length; i++) {
                this.offChange(expr.watchChain[i], callback);
            }
        };

        return root;
    }
}

module.exports = PskBindableModel;

},{"soundpubsub":"soundpubsub"}],"D:\\privatesky\\modules\\soundpubsub\\lib\\soundPubSub.js":[function(require,module,exports){
/*
Initial License: (c) Axiologic Research & Alboaie Sînică.
Contributors: Axiologic Research , PrivateSky project
Code License: LGPL or MIT.
*/


/**
 *   Usually an event could cause execution of other callback events . We say that is a level 1 event if is causeed by a level 0 event and so on
 *
 *      SoundPubSub provides intuitive results regarding to asynchronous calls of callbacks and computed values/expressions:
 *   we prevent immediate execution of event callbacks to ensure the intuitive final result is guaranteed as level 0 execution
 *   we guarantee that any callback function is "re-entrant"
 *   we are also trying to reduce the number of callback execution by looking in queues at new messages published by
 *   trying to compact those messages (removing duplicate messages, modifying messages, or adding in the history of another event ,etc)
 *
 *      Example of what can be wrong without non-sound asynchronous calls:
 *
 *  Step 0: Initial state:
 *   a = 0;
 *   b = 0;
 *
 *  Step 1: Initial operations:
 *   a = 1;
 *   b = -1;
 *
 *  // an observer reacts to changes in a and b and compute CORRECT like this:
 *   if( a + b == 0) {
 *       CORRECT = false;
 *       notify(...); // act or send a notification somewhere..
 *   } else {
 *      CORRECT = false;
 *   }
 *
 *    Notice that: CORRECT will be true in the end , but meantime, after a notification was sent and CORRECT was wrongly, temporarily false!
 *    soundPubSub guarantee that this does not happen because the syncronous call will before any observer (bot asignation on a and b)
 *
 *   More:
 *   you can use blockCallBacks and releaseCallBacks in a function that change a lot a collection or bindable objects and all
 *   the notifications will be sent compacted and properly
 */

// TODO: optimisation!? use a more efficient queue instead of arrays with push and shift!?
// TODO: see how big those queues can be in real applications
// for a few hundreds items, queues made from array should be enough
//*   Potential TODOs:
//    *     prevent any form of problem by calling callbacks in the expected order !?
//*     preventing infinite loops execution cause by events!?
//*
//*
// TODO: detect infinite loops (or very deep propagation) It is possible!?

const Queue = require('queue');

function SoundPubSub(){

	let subscriberCbkRefHandler = new SubscriberCallbackReferenceHandler();

	/**
	 * publish
	 *      Publish a message {Object} to a list of subscribers on a specific topic
	 *
	 * @params {String|Number} target,  {Object} message
	 * @return number of channel subscribers that will be notified
	 */
	this.publish = function(target, message){
		if(!invalidChannelName(target) && !invalidMessageType(message) && (typeof channelSubscribers[target] != 'undefined')){
			compactAndStore(target, message);
			setTimeout(dispatchNext, 0);
			return channelSubscribers[target].length;
		} else {
			return null;
		}
	};

	/**
	 * subscribe
	 *      Subscribe / add a {Function} callBack on a {String|Number}target channel subscribers list in order to receive
	 *      messages published if the conditions defined by {Function}waitForMore and {Function}filter are passed.
	 *
	 * @params {String|Number}target, {Function}callBack, {Function}waitForMore, {Function}filter
	 *
	 *          target      - channel name to subscribe
	 *          callback    - function to be called when a message was published on the channel
	 *          waitForMore - a intermediary function that will be called after a successfuly message delivery in order
	 *                          to decide if a new messages is expected...
	 *          filter      - a function that receives the message before invocation of callback function in order to allow
	 *                          relevant message before entering in normal callback flow
	 * @return
	 */
	this.subscribe = function(target, callBack, waitForMore, filter){
		if(!invalidChannelName(target) && !invalidFunction(callBack)){
			let subscriber = {"waitForMore": waitForMore, "filter": filter};
			if(typeof channelSubscribers[target] === 'undefined'){
				channelSubscribers[target] = [];
			}
			subscriberCbkRefHandler.setSubscriberCallback(subscriber, target, callBack);
			channelSubscribers[target].push(subscriber);
		}
	};

	/**
	 * unsubscribe
	 *      Unsubscribe/remove {Function} callBack from the list of subscribers of the {String|Number} target channel
	 *
	 * @params {String|Number} target, {Function} callBack, {Function} filter
	 *
	 *          target      - channel name to unsubscribe
	 *          callback    - reference of the original function that was used as subscribe
	 *          filter      - reference of the original filter function
	 * @return
	 */
	this.unsubscribe = function(target, callBack, filter){
		if(!invalidFunction(callBack)){
			//let gotIt = false;
			if(channelSubscribers[target]){
				for(let i = 0; i < channelSubscribers[target].length;i++){
					let subscriber =  channelSubscribers[target][i];
					let callback = subscriberCbkRefHandler.getSubscriberCallback(subscriber);

					if(callback === callBack && ( typeof filter === 'undefined' || subscriber.filter === filter )){
						//gotIt = true;
						subscriber.forDelete = true;
						subscriber.callBack = undefined;
						subscriber.filter = undefined;
					}
				}
			}
			//not valid always since we introduced WeakRef. A subscriber callback could not exists
			// if(!gotIt){
			// 	console.log("Unable to unsubscribe a callback that was not subscribed!");
			// }
		}
	};

	/**
	 * blockCallBacks
	 *
	 * @params
	 * @return
	 */
	this.blockCallBacks = function(){
		level++;
	};

	/**
	 * releaseCallBacks
	 *
	 * @params
	 * @return
	 */
	this.releaseCallBacks = function(){
		level--;
		//hack/optimisation to not fill the stack in extreme cases (many events caused by loops in collections,etc)
		while(level === 0 && dispatchNext(true)){
			//nothing
		}

		while(level === 0 && callAfterAllEvents()){
            //nothing
		}
	};

	/**
	 * afterAllEvents
	 *
	 * @params {Function} callback
	 *
	 *          callback - function that needs to be invoked once all events are delivered
	 * @return
	 */
	this.afterAllEvents = function(callBack){
		if(!invalidFunction(callBack)){
			afterEventsCalls.push(callBack);
		}
		this.blockCallBacks();
		this.releaseCallBacks();
	};

	/**
	 * hasChannel
	 *
	 * @params {String|Number} channel
	 *
	 *          channel - name of the channel that need to be tested if present
	 * @return
	 */
	this.hasChannel = function(channel){
		return !invalidChannelName(channel) && (typeof channelSubscribers[channel] != 'undefined') ? true : false;
	};

	/**
	 * addChannel
	 *
	 * @params {String} channel
	 *
	 *          channel - name of a channel that needs to be created and added to soundpubsub repository
	 * @return
	 */
	this.addChannel = function(channel){
		if(!invalidChannelName(channel) && !this.hasChannel(channel)){
			channelSubscribers[channel] = [];
		}
	};

	/* ---------------------------------------- protected stuff ---------------------------------------- */
	var self = this;
	// map channelName (object local id) -> array with subscribers
	var channelSubscribers = {};

	// map channelName (object local id) -> queue with waiting messages
	var channelsStorage = {};

	// object
	var typeCompactor = {};

	// channel names
	var executionQueue = new Queue();
	var level = 0;



	/**
	 * registerCompactor
	 *
	 *       An compactor takes a newEvent and and oldEvent and return the one that survives (oldEvent if
	 *  it can compact the new one or the newEvent if can't be compacted)
	 *
	 * @params {String} type, {Function} callBack
	 *
	 *          type        - channel name to unsubscribe
	 *          callBack    - handler function for that specific event type
	 * @return
	 */
	this.registerCompactor = function(type, callBack) {
		if(!invalidFunction(callBack)){
			typeCompactor[type] = callBack;
		}
	};

	/**
	 * dispatchNext
	 *
	 * @param fromReleaseCallBacks: hack to prevent too many recursive calls on releaseCallBacks
	 * @return {Boolean}
	 */
	function dispatchNext(fromReleaseCallBacks){
		if(level > 0) {
			return false;
		}
		const channelName = executionQueue.front();
		if(typeof channelName != 'undefined'){
			self.blockCallBacks();
			try{
				let message;
				if(!channelsStorage[channelName].isEmpty()) {
					message = channelsStorage[channelName].front();
				}
				if(typeof message == 'undefined'){
					if(!channelsStorage[channelName].isEmpty()){
						console.log("Can't use as message in a pub/sub channel this object: " + message);
					}
					executionQueue.pop();
				} else {
					if(typeof message.__transmisionIndex == 'undefined'){
						message.__transmisionIndex = 0;
						for(var i = channelSubscribers[channelName].length-1; i >= 0 ; i--){
							var subscriber =  channelSubscribers[channelName][i];
							if(subscriber.forDelete === true){
								channelSubscribers[channelName].splice(i,1);
							}
						}
					} else {
						message.__transmisionIndex++;
					}
					//TODO: for immutable objects it will not work also, fix for shape models
					if(typeof message.__transmisionIndex == 'undefined'){
						console.log("Can't use as message in a pub/sub channel this object: " + message);
					}
					subscriber = channelSubscribers[channelName][message.__transmisionIndex];
					if(typeof subscriber == 'undefined'){
						delete message.__transmisionIndex;
						channelsStorage[channelName].pop();
					} else {
						if(subscriber.filter === null || typeof subscriber.filter === "undefined" || (!invalidFunction(subscriber.filter) && subscriber.filter(message))){
							if (!subscriber.forDelete) {
								let callback = subscriberCbkRefHandler.getSubscriberCallback(subscriber);
								if (typeof callback === "undefined") {
									subscriber.forDelete = true;
								} else {
									callback(message);
									if (subscriber.waitForMore && !invalidFunction(subscriber.waitForMore) && !subscriber.waitForMore(message)) {
										subscriber.forDelete = true;
									}
								}
							}
						}
					}
				}
			} catch(err){
				console.log("Event callback failed: "+ subscriber.callBack +"error: " + err.stack);
			}
			//
			if(fromReleaseCallBacks){
				level--;
			} else {
				self.releaseCallBacks();
			}
			return true;
		} else {
			return false;
		}
	}

	function compactAndStore(target, message){
		var gotCompacted = false;
		var arr = channelsStorage[target];
		if(typeof arr == 'undefined'){
			arr = new Queue();
			channelsStorage[target] = arr;
		}

		if(message && typeof message.type != 'undefined'){
			var typeCompactorCallBack = typeCompactor[message.type];

			if(typeof typeCompactorCallBack != 'undefined'){
				for(let channel of arr) {
					if(typeCompactorCallBack(message, channel) === channel) {
						if(typeof channel.__transmisionIndex == 'undefined') {
							gotCompacted = true;
							break;
						}
					}
				}
			}
		}

		if(!gotCompacted && message){
			arr.push(message);
			executionQueue.push(target);
		}
	}

	var afterEventsCalls = new Queue();
	function callAfterAllEvents (){
		if(!afterEventsCalls.isEmpty()){
			var callBack = afterEventsCalls.pop();
			//do not catch exceptions here..
			callBack();
		}
		return !afterEventsCalls.isEmpty();
	}

	function invalidChannelName(name){
		var result = false;
		if(!name || (typeof name != "string" && typeof name != "number")){
			result = true;
			console.log("Invalid channel name: " + name);
		}

		return result;
	}

	function invalidMessageType(message){
		var result = false;
		if(!message || typeof message != "object"){
			result = true;
			console.log("Invalid messages types: " + message);
		}
		return result;
	}

	function invalidFunction(callback){
		var result = false;
		if(!callback || typeof callback != "function"){
			result = true;
			console.log("Expected to be function but is: " + callback);
		}
		return result;
	}

	//weak references are not supported by all browsers
	function SubscriberCallbackReferenceHandler(){
		let finalizationRegistry;
		let hasWeakReferenceSupport = weakReferencesAreSupported();


		if (hasWeakReferenceSupport) {
			finalizationRegistry = new FinalizationRegistry((heldValue) => {
		   		//console.log(`Cleanup ${heldValue}`);
			});
		}

		this.setSubscriberCallback  = function (subscriber, target, callback){
			if(hasWeakReferenceSupport){
				subscriber.callBack = new WeakRef(callback);
				finalizationRegistry.register(subscriber.callBack, target);
			}
			else {
				subscriber.callBack = callback;
			}
		};

		this.getSubscriberCallback = function (subscriber){
			if(hasWeakReferenceSupport){
				if(subscriber.callBack){
					return subscriber.callBack.deref();
				}
				return undefined;

			}
			return subscriber.callBack;
		};

		function weakReferencesAreSupported() {
			return typeof FinalizationRegistry === "function" && typeof WeakRef === "function";
		}
	}


}

exports.soundPubSub = new SoundPubSub();

},{"queue":"queue"}],"overwrite-require":[function(require,module,exports){
(function (global){(function (){
/*
 require and $$.require are overwriting the node.js defaults in loading modules for increasing security, speed and making it work to the privatesky runtime build with browserify.
 The privatesky code for domains should work in node and browsers.
 */
function enableForEnvironment(envType){

    const moduleConstants = require("./moduleConstants");

    /**
     * Used to provide autocomplete for $$ variables
     * @classdesc Interface for $$ object
     *
     * @name $$
     * @class
     *
     */

    switch (envType) {
        case moduleConstants.BROWSER_ENVIRONMENT_TYPE :
            global = window;
            break;
        case moduleConstants.WEB_WORKER_ENVIRONMENT_TYPE:
        case moduleConstants.SERVICE_WORKER_ENVIRONMENT_TYPE:
            global = self;
            break;
        default:
            Error.stackTraceLimit = Infinity;
    }

    if (typeof(global.$$) == "undefined") {
        /**
         * Used to provide autocomplete for $$ variables
         * @type {$$}
         */
        global.$$ = {};
    }

    if (typeof($$.__global) == "undefined") {
        $$.__global = {};
    }

    if (typeof global.wprint === "undefined") {
        global.wprint = console.warn;
    }
    Object.defineProperty($$, "environmentType", {
        get: function(){
            return envType;
        },
        set: function (value) {
            throw Error("Environment type already set!");
        }
    });


    if (typeof($$.__global.requireLibrariesNames) == "undefined") {
        $$.__global.currentLibraryName = null;
        $$.__global.requireLibrariesNames = {};
    }


    if (typeof($$.__runtimeModules) == "undefined") {
        $$.__runtimeModules = {};
    }


    if (typeof(global.functionUndefined) == "undefined") {
        global.functionUndefined = function () {
            console.log("Called of an undefined function!!!!");
            throw new Error("Called of an undefined function");
        };
        if (typeof(global.webshimsRequire) == "undefined") {
            global.webshimsRequire = global.functionUndefined;
        }

        if (typeof(global.domainRequire) == "undefined") {
            global.domainRequire = global.functionUndefined;
        }

        if (typeof(global.pskruntimeRequire) == "undefined") {
            global.pskruntimeRequire = global.functionUndefined;
        }
    }

    const pastRequests = {};

    function preventRecursiveRequire(request) {
        if (pastRequests[request]) {
            const err = new Error("Preventing recursive require for " + request);
            err.type = "PSKIgnorableError";
            throw err;
        }

    }

    function disableRequire(request) {
        pastRequests[request] = true;
    }

    function enableRequire(request) {
        pastRequests[request] = false;
    }

    function requireFromCache(request) {
        const existingModule = $$.__runtimeModules[request];
        return existingModule;
    }

    $$.__registerModule = function (name, module) {
        $$.__runtimeModules[name] = module;
    };

    function wrapStep(callbackName) {
        const callback = global[callbackName];

        if (callback === undefined) {
            return null;
        }

        if (callback === global.functionUndefined) {
            return null;
        }

        return function (request) {
            const result = callback(request);
            $$.__runtimeModules[request] = result;
            return result;
        }
    }


    function tryRequireSequence(originalRequire, request) {
        let arr;
        if (originalRequire) {
            arr = $$.__requireFunctionsChain.slice();
            arr.push(originalRequire);
        } else {
            arr = $$.__requireFunctionsChain;
        }

        preventRecursiveRequire(request);
        disableRequire(request);
        let result;
        const previousRequire = $$.__global.currentLibraryName;
        let previousRequireChanged = false;

        if (!previousRequire) {
            // console.log("Loading library for require", request);
            $$.__global.currentLibraryName = request;

            if (typeof $$.__global.requireLibrariesNames[request] == "undefined") {
                $$.__global.requireLibrariesNames[request] = {};
                //$$.__global.requireLibrariesDescriptions[request]   = {};
            }
            previousRequireChanged = true;
        }
        for (let i = 0; i < arr.length; i++) {
            const func = arr[i];
            try {

                if (func === global.functionUndefined) continue;
                result = func(request);

                if (result) {
                    break;
                }

            } catch (err) {
                if (err.type !== "PSKIgnorableError") {
                    if(typeof err == "SyntaxError"){
                        console.error(err);
                    } else {
                        if(request === 'zeromq'){
                            console.warn("Failed to load module ", request," with error:", err.message);
                        }else {
                            console.error("Failed to load module ", request," with error:", err);
                        }
                    }
                    //$$.err("Require encountered an error while loading ", request, "\nCause:\n", err.stack);
                }
            }
        }

        if (!result) {
            throw Error(`Failed to load module ${request}`);
        }

        enableRequire(request);
        if (previousRequireChanged) {
            //console.log("End loading library for require", request, $$.__global.requireLibrariesNames[request]);
            $$.__global.currentLibraryName = null;
        }
        return result;
    }

    function makeBrowserRequire(){
        console.log("Defining global require in browser");


        global.require = function (request) {

            ///*[requireFromCache, wrapStep(webshimsRequire), , wrapStep(pskruntimeRequire), wrapStep(domainRequire)*]
            return tryRequireSequence(null, request);
        };
    }

    function makeIsolateRequire(){
        // require should be provided when code is loaded in browserify
        const bundleRequire = require;

        $$.requireBundle('sandboxBase');
        // this should be set up by sandbox prior to
        const sandboxRequire = global.require;
        const cryptoModuleName = 'crypto';
        global.crypto = require(cryptoModuleName);

        function newLoader(request) {
            // console.log("newLoader:", request);
            //preventRecursiveRequire(request);
            const self = this;

            // console.log('trying to load ', request);

            function tryBundleRequire(...args) {
                //return $$.__originalRequire.apply(self,args);
                //return Module._load.apply(self,args)
                let res;
                try {
                    res = sandboxRequire.apply(self, args);
                } catch (err) {
                    if (err.code === "MODULE_NOT_FOUND") {
                        const p = path.join(process.cwd(), request);
                        res = sandboxRequire.apply(self, [p]);
                        request = p;
                    } else {
                        throw err;
                    }
                }
                return res;
            }

            let res;


            res = tryRequireSequence(tryBundleRequire, request);


            return res;
        }

        global.require = newLoader;
    }

    function makeNodeJSRequire(){
        const pathModuleName = 'path';
        const path = require(pathModuleName);
        const cryptoModuleName = 'crypto';
        const utilModuleName = 'util';
        $$.__runtimeModules["crypto"] = require(cryptoModuleName);
        $$.__runtimeModules["util"] = require(utilModuleName);

        const moduleModuleName = 'module';
        const Module = require(moduleModuleName);
        $$.__runtimeModules["module"] = Module;

        console.log("Redefining require for node");

        $$.__originalRequire = Module._load;
        const moduleOriginalRequire = Module.prototype.require;

        function newLoader(request) {
            // console.log("newLoader:", request);
            //preventRecursiveRequire(request);
            const self = this;

            function originalRequire(...args) {
                //return $$.__originalRequire.apply(self,args);
                //return Module._load.apply(self,args)
                let res;
                try {
                    res = moduleOriginalRequire.apply(self, args);
                } catch (err) {
                    if (err.code === "MODULE_NOT_FOUND") {
                        let pathOrName = request;
                        if(pathOrName.startsWith('/') || pathOrName.startsWith('./') || pathOrName.startsWith('../')){
                            pathOrName = path.join(process.cwd(), request);
                        }
                        res = moduleOriginalRequire.call(self, pathOrName);
                        request = pathOrName;
                    } else {
                        throw err;
                    }
                }
                return res;
            }

            function currentFolderRequire(request) {
                return
            }

            //[requireFromCache, wrapStep(pskruntimeRequire), wrapStep(domainRequire), originalRequire]
            return tryRequireSequence(originalRequire, request);
        }

        Module.prototype.require = newLoader;
        return newLoader;
    }

    require("./standardGlobalSymbols.js");

    if (typeof($$.require) == "undefined") {

        $$.__requireList = ["webshimsRequire"];
        $$.__requireFunctionsChain = [];

        $$.requireBundle = function (name) {
            name += "Require";
            $$.__requireList.push(name);
            const arr = [requireFromCache];
            $$.__requireList.forEach(function (item) {
                const callback = wrapStep(item);
                if (callback) {
                    arr.push(callback);
                }
            });

            $$.__requireFunctionsChain = arr;
        };

        $$.requireBundle("init");

        switch ($$.environmentType) {
            case moduleConstants.BROWSER_ENVIRONMENT_TYPE:
                makeBrowserRequire();
                $$.require = require;
                break;
            case moduleConstants.WEB_WORKER_ENVIRONMENT_TYPE:
                makeBrowserRequire();
                $$.require = require;
                break;
            case moduleConstants.SERVICE_WORKER_ENVIRONMENT_TYPE:
                makeBrowserRequire();
                $$.require = require;
                break;
            case moduleConstants.ISOLATE_ENVIRONMENT_TYPE:
                makeIsolateRequire();
                $$.require = require;
                break;
            default:
               $$.require = makeNodeJSRequire();
        }

    }

    $$.promisify = function promisify(fn) {
        return function (...args) {
            return new Promise((resolve, reject) => {
                fn(...args, (err, ...res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(...res);
                    }
                });
            });
        };
    };

    $$.makeSaneCallback = function makeSaneCallback(fn) {
        let alreadyCalled = false;
        return (err, res, ...args) => {
            if (alreadyCalled) {
                if (err) {
                    console.log('Sane callback error:', err);
                }

                throw new Error(`Callback called 2 times! Second call was stopped. Function code:\n${fn.toString()}\n`);
            }
            alreadyCalled = true;
            return fn(err, res, ...args);
        };
    };
}



module.exports = {
    enableForEnvironment,
    constants: require("./moduleConstants")
};

}).call(this);}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

},{"./moduleConstants":"D:\\privatesky\\modules\\overwrite-require\\moduleConstants.js","./standardGlobalSymbols.js":"D:\\privatesky\\modules\\overwrite-require\\standardGlobalSymbols.js"}],"psk-bindable-model":[function(require,module,exports){
module.exports = require("./lib/PskBindableModel");
},{"./lib/PskBindableModel":"D:\\privatesky\\modules\\psk-bindable-model\\lib\\PskBindableModel.js"}],"queue":[function(require,module,exports){
function QueueElement(content) {
	this.content = content;
	this.next = null;
}

function Queue() {
	this.head = null;
	this.tail = null;
	this.length = 0;
	this.push = function (value) {
		const newElement = new QueueElement(value);
		if (!this.head) {
			this.head = newElement;
			this.tail = newElement;
		} else {
			this.tail.next = newElement;
			this.tail = newElement;
		}
		this.length++;
	};

	this.pop = function () {
		if (!this.head) {
			return null;
		}
		const headCopy = this.head;
		this.head = this.head.next;
		this.length--;

		//fix???????
		if(this.length === 0){
            this.tail = null;
		}

		return headCopy.content;
	};

	this.front = function () {
		return this.head ? this.head.content : undefined;
	};

	this.isEmpty = function () {
		return this.head === null;
	};

	this[Symbol.iterator] = function* () {
		let head = this.head;
		while(head !== null) {
			yield head.content;
			head = head.next;
		}
	}.bind(this);
}

Queue.prototype.toString = function () {
	let stringifiedQueue = '';
	let iterator = this.head;
	while (iterator) {
		stringifiedQueue += `${JSON.stringify(iterator.content)} `;
		iterator = iterator.next;
	}
	return stringifiedQueue;
};

Queue.prototype.inspect = Queue.prototype.toString;

module.exports = Queue;

},{}],"soundpubsub":[function(require,module,exports){
module.exports = {
					soundPubSub: require("./lib/soundPubSub").soundPubSub
};
},{"./lib/soundPubSub":"D:\\privatesky\\modules\\soundpubsub\\lib\\soundPubSub.js"}]},{},["D:\\privatesky\\builds\\tmp\\bindableModel.js"])
                    ;(function(global) {
                        global.bundlePaths = {"webshims":"D:\\privatesky\\psknode\\bundles\\webshims.js","pskruntime":"D:\\privatesky\\psknode\\bundles\\pskruntime.js","pskWebServer":"D:\\privatesky\\psknode\\bundles\\pskWebServer.js","consoleTools":"D:\\privatesky\\psknode\\bundles\\consoleTools.js","blockchain":"D:\\privatesky\\psknode\\bundles\\blockchain.js","openDSU":"D:\\privatesky\\psknode\\bundles\\openDSU.js","nodeBoot":"D:\\privatesky\\psknode\\bundles\\nodeBoot.js","testsRuntime":"D:\\privatesky\\psknode\\bundles\\testsRuntime.js","bindableModel":"D:\\privatesky\\psknode\\bundles\\bindableModel.js","loaderBoot":"D:\\privatesky\\psknode\\bundles\\loaderBoot.js","swBoot":"D:\\privatesky\\psknode\\bundles\\swBoot.js","iframeBoot":"D:\\privatesky\\psknode\\bundles\\iframeBoot.js","launcherBoot":"D:\\privatesky\\psknode\\bundles\\launcherBoot.js","testRunnerBoot":"D:\\privatesky\\psknode\\bundles\\testRunnerBoot.js"};
                    })(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});

const PskBindableModel = bindableModelRequire('psk-bindable-model');

const virtualHistory = new Set();
let isLocationListenerActive = false;

function checkEventListener(eventName, listener, options) {
  if (typeof eventName !== 'string' || eventName.trim().length === 0) {
    throw Error(`
      Argument eventName is not valid. It must be a non-empty string.
      Provided value: ${eventName}
    `);
  }

  if (typeof listener !== 'function') {
    throw Error(`
      Argument listener is not valid, it must be a function.
      Provided value: ${listener}
    `);
  }

  if (options && typeof options !== 'boolean' && typeof options !== 'object') {
    throw Error(`
      Argument options is not valid, it must a boolean (true/false) in case of capture, or an options object.
      If no options are needed, this argument can be left empty.
      Provided value: ${options}
    `);
  }
}

function isRequireAvailable() {
  // eslint-disable-next-line no-undef
  return window['$$'] && $$.require;
}

function isSkinEnabled() {
  const { state } = window.WebCardinal || {};
  return state && state.skin && typeof state.skin === 'string';
}

function getPathname() {
  let { pathname } = window.location;
  if (pathname === '/') {
    return pathname;
  }
  if (pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function getValueFromModelByChain(model, chain) {
  if (typeof chain === 'string') {
    chain = chain.split('.');
  }
  const key = chain.shift();
  return chain.length ? getValueFromModelByChain(model[key], chain) : model[key];
}

function getTranslationModel() {
  if (!getTranslationsFromState()) {
    return;
  }

  let { translations } = window.WebCardinal;
  const skin = getSkinFromState();
  const pathname = getPathname();

  const skinTranslations = translations[skin];
  const defaultTranslations = translations['default'];

  if (!skinTranslations && !defaultTranslations) {
    console.warn(`No translations found for skins: "${skin}"${skin !== 'default' ? ' and "default"' : ''}`);
    return;
  }

  let pageTranslations = skinTranslations && skinTranslations[pathname];

  if (pageTranslations) {
    return pageTranslations;
  }

  pageTranslations = defaultTranslations && defaultTranslations[pathname];

  if (!pageTranslations) {
    console.warn(
      `No translations found for page: "${pathname}" (skins: "${skin}"${skin !== 'default' ? ' and "default"' : ''}`,
    );
    return;
  }

  return pageTranslations;
}

function clearVirtualHistory() {
  if (!document.querySelector('webc-app-loader[data-key]')) {
    virtualHistory.clear();
  }
}

function locationListener_v1(history) {
  /**
   It supports: goBack(), goForward()
   But the DOM is full with instances of webc-app-loader when a new page is requested
   */
  const inactiveKeys = Array.from(virtualHistory).filter(key => key !== history.location.key);

  const loaders = document.querySelectorAll('webc-app-loader[data-key]');
  const originalLoader = document.querySelector('webc-app-loader[save-state]:not([data-key])');
  originalLoader.setAttribute('hidden', '');

  for (const loader of Array.from(loaders)) {
    if (inactiveKeys.includes(loader.dataset.key)) {
      loader.setAttribute('hidden', '');
      continue;
    }

    loader.removeAttribute('hidden');
  }

  for (const loader of Array.from(loaders)) {
    if (!loader.hasAttribute('hidden')) {
      return;
    }
  }

  originalLoader.removeAttribute('hidden');
}

function locationListener_v2(history) {
  /**
   It supports: goBack() only
   The DOM is managed better then @ref locationListener_v1
   */
  const activeKey = history.location.key;
  const inactiveKeys = Array.from(virtualHistory).filter(key => key !== activeKey);

  let shouldBeRemove = true;
  let loaders = document.querySelectorAll('webc-app-loader[data-key]');
  for (const loader of Array.from(loaders)) {
    if (loader.dataset.key === activeKey || loader.dataset.key === 'not-generated-yet') {
      loader.removeAttribute('hidden');
      WebCardinal.state.page.loader = loader;
      WebCardinal.state.page.src = loader.src;
      shouldBeRemove = false;
      continue;
    }

    if (shouldBeRemove) {
      loader.remove();
      continue;
    }

    loader.setAttribute('hidden', '');
  }

  const originalLoader = document.querySelector('webc-app-loader[save-state]:not([data-key])');
  originalLoader.setAttribute('hidden', '');

  loaders = document.querySelectorAll('webc-app-loader[data-key]');
  for (const loader of Array.from(loaders)) {
    if (!loader.hasAttribute('hidden')) {
      return;
    }
  }

  originalLoader.removeAttribute('hidden');
}

function proxifyModelProperty(model) {
  if (!model || typeof model !== 'object') {
    console.warn('A model must be an object!');
    return;
  }

  /*
   * A valid psk_bindable_model must be a proxy with the following functions
   * addExpression, evaluateExpression, hasExpression, onChangeExpressionChain, toObject
   */

  if (typeof model.onChangeExpressionChain === 'undefined') {
    return PskBindableModel.setModel(model);
  }
  return model;
}

class Controller {
  /**
   * Controller exposes the main functions used in the WebCardinal
   * (WebCardinal Controllers API)
   *
   * @param {HTMLElement} element - Controller is applied to this element
   * @param {RouterHistory} history - Custom History object received from Stencil Router
   * @param {Proxy | undefined} [_model]  - The model received from another WebcComponent if data-view-model is present
   * @param {Proxy | {}} [_translationModel] - The translationModel received from an above WebcComponent
   */
  constructor(element, history, _model, _translationModel) {
    this.element = element;
    this.history = history;
    this.tagEventListeners = [];
    this._dsuStorage = undefined;

    let model;
    if (_model && this.element.hasAttribute(VIEW_MODEL_KEY)) {
      let chain = this.element.getAttribute(VIEW_MODEL_KEY);
      if (chain.startsWith(MODEL_CHAIN_PREFIX)) {
        chain = chain.slice(1);
      }
      if (chain) {
        model = PskBindableModel.setModel(getValueFromModelByChain(_model, chain));
      } else {
        model = _model;
      }
    }

    Object.defineProperty(this, 'model', {
      get() {
        //return a friendly non-undefined model that will be well digested by the binding services
        if (!model) {
          model = PskBindableModel.setModel({});
        }
        return model;
      },
      set(modelToSet) {
        if (model) {
          // update the current model without overwriting it
          Object.keys(modelToSet).forEach(modelKey => {
            model[modelKey] = modelToSet[modelKey];
          });
        } else {
          model = PskBindableModel.setModel(modelToSet);
        }
      },
    });

    this.setLegacyGetModelEventListener();

    this.translationModel = _translationModel || PskBindableModel.setModel(getTranslationModel() || {});

    // will need to be called when the controller will be removed
    this.disconnectedCallback = () => {
      this.removeAllTagEventListeners();
      this.onDisconnectedCallback();
    };

    if (typeof this.element.componentOnReady === 'function') {
      this.element.componentOnReady().then(this.onReady.bind(this));
    } else {
      this.onReady();
    }

    // listener required for virtual pages created with "this.pushPage"
    if (!isLocationListenerActive) {
      this.history.listen(() => locationListener_v2(this.history));
      isLocationListenerActive = true;
    }
  }

  /**
   * It creates an element by its tag name and applies all the given properties
   *
   * @param {string} tagName - The name of the HTMLElement that will be created
   * @param {object} properties - Properties of the new created element
   *
   * @returns {HTMLElement}
   *
   * If "is" functionality from ElementCreationOptions is desired, use "document.createElement instead
   */
  createElement(tagName, properties) {
    if (properties && properties.model) {
      properties.model = proxifyModelProperty(properties.model);
    }
    return Object.assign(document.createElement(tagName), properties);
  }

  /**
   * It creates an element by its tag name, applies all the given properties
   * then the element is appended in current context of this Controller (this.element)
   *
   * @param {string} tagName - The name of the HTMLElement that will be created
   * @param {object} properties - Properties of the new created element
   *
   * @returns {HTMLElement}
   */
  createAndAddElement(tagName, properties) {
    const element = this.createElement(tagName, properties);
    this.element.append(element);
    return element;
  }

  on(eventName, listener, options) {
    try {
      checkEventListener(eventName, listener, options);
      this.element.addEventListener(eventName, listener, options);
    } catch (err) {
      console.error(err);
    }
  }

  off(eventName, listener, options) {
    try {
      checkEventListener(eventName, listener, options);
      this.element.removeEventListener(eventName, listener, options);
    } catch (error) {
      console.error(error);
    }
  }

  onReady() {}

  onDisconnectedCallback() {}

  removeAllTagEventListeners() {
    this.tagEventListeners.forEach(x => {
      this.element.removeEventListener(x.eventName, x.eventListener, x.options);
    });
  }

  onTagEvent(tag, eventName, listener, options) {
    try {
      checkEventListener(eventName, listener, options);

      const eventListener = event => {
        let target = event.target;

        while (target && target !== this.element) {
          if (target.getAttribute(TAG_ATTRIBUTE) === tag) {
            event.preventDefault(); // Cancel the native event
            event.stopPropagation(); // Don't bubble/capture the event any further

            const attachedModel = target[TAG_MODEL_FUNCTION_PROPERTY] ? target[TAG_MODEL_FUNCTION_PROPERTY]() : null;

            listener(attachedModel, target, event);
            break;
          }

          target = target.parentElement;
        }
      };

      const tagEventListener = {
        tag,
        eventName,
        listener,
        eventListener,
        options,
      };
      this.tagEventListeners.push(tagEventListener);

      // if this.element is a custom element with "shadow" created with webc-component
      // all the listeners must be attached inside of the shadowRoot
      // (if this custom element has a Controller, listeners are attached to webc-container)
      let listenersElement = this.element;
      if (this.element.hasAttribute('shadow') && this.element.shadowRoot) {
        listenersElement = this.element.shadowRoot;
      }
      listenersElement.addEventListener(eventName, eventListener, options);
    } catch (err) {
      console.error(err);
    }
  }

  offTagEvent(tag, eventName, listener, options) {
    try {
      checkEventListener(eventName, listener, options);

      const tagEventListenerIndexesToRemove = [];
      this.tagEventListeners
        .filter((x, index) => {
          const isMatch =
            x.tag === tag && x.eventName === eventName && x.listener === listener && x.options === options;
          if (isMatch) {
            tagEventListenerIndexesToRemove.push(index);
          }
          return isMatch;
        })
        .forEach(x => {
          this.element.removeEventListener(eventName, x.eventListener, options);
        });

      // remove the listeners also  from this.tagEventListeners
      if (tagEventListenerIndexesToRemove.length) {
        tagEventListenerIndexesToRemove.reverse();
        tagEventListenerIndexesToRemove.forEach(indexToRemove => {
          this.tagEventListeners.splice(indexToRemove, 1);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  onTagClick(tag, listener, options) {
    this.onTagEvent(tag, 'click', listener, options);
  }

  offTagClick(tag, listener, options) {
    this.offTagEvent(tag, 'click', listener, options);
  }

  navigateToUrl(url, state) {
    this.history.push(url, state);
  }

  navigateToPageTag(tag, state) {
    this.element.dispatchEvent(
      new CustomEvent('webcardinal:tags:get', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          tag,
          callback: (error, path) => {
            if (error) {
              console.error(error);
              return;
            }
            this.navigateToUrl(path, state);
          },
        },
      }),
    );
  }

  async pushPage(src, options) {
    clearVirtualHistory();

    if (!options) {
      options = {};
    }
    if (!options.parentElement) {
      options.parentElement = document.querySelector('stencil-route:not([style="display: none;"])');
    }
    if (!options.namespace) {
      options.namespace = PAGES_PATH;
    }
    if (!options.skin) {
      options.skin = this.getSkin();
    }
    if (typeof options.tag !== 'string') {
      options.tag = undefined;
    }

    const { basePath } = WebCardinal;
    const { parentElement, namespace, skin, tag } = options;
    const { pathname } = this.history.location;

    src = URLHelper.join('', namespace, src).pathname;
    if (src.startsWith('/')) {
      src = `.${src}`;
    }
    if (!src.endsWith('.html')) {
      src += '.html';
    }

    const backData = {
      src: WebCardinal.state.page.loader.src,
      key: this.history.location.key,
    };

    const oldLoader = WebCardinal.state.page.loader;
    const pageLoader = this.createElement('webc-app-loader', { src, basePath, skin, tag, saveState: true });
    pageLoader.setAttribute('hidden', '');
    pageLoader.dataset.key = 'not-generated-yet';
    parentElement.prepend(pageLoader);

    await pageLoader.componentOnReady();
    oldLoader.setAttribute('hidden', '');
    pageLoader.removeAttribute('hidden');

    this.history.push(pathname, options.state);
    const forwardData = {
      src,
      key: this.history.location.key,
    };
    pageLoader.dataset.key = forwardData.key;

    virtualHistory.add(forwardData.key);
    virtualHistory.add(backData.key);
  }

  getVirtualHistory() {
    return Object.freeze(virtualHistory);
  }

  send(eventName, detail, options = {}) {
    let eventOptions = {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail,
      ...options,
    };

    this.element.dispatchEvent(new CustomEvent(eventName, eventOptions));
  }

  setLegacyGetModelEventListener() {
    let dispatchModel = function (bindValue, model, callback) {
      if (bindValue && model[bindValue]) {
        callback(null, model[bindValue]);
      }

      if (!bindValue) {
        callback(null, model);
      }
    };

    this.element.addEventListener('getModelEvent', e => {
      e.preventDefault();
      e.stopImmediatePropagation();

      let { bindValue, callback } = e.detail;

      if (typeof callback === 'function') {
        return dispatchModel(bindValue, this.model, callback);
      }

      callback(new Error('No callback provided'));
    });
  }

  setState(state) {
    this.history.location.state = state;
  }

  getState() {
    return this.history.location.state;
  }

  updateState(key, value) {
    this.setState({
      ...(this.getState() || {}),
      [key]: value,
    });
  }

  removeFromState(key) {
    const state = this.getState();
    delete state[key];
    this.setState(state);
  }

  setSkin(skin, { save } = { save: true }) {
    if (!isSkinEnabled()) {
      console.warn('WebCardinal skin is not set by your Application!');
      return;
    }

    if (typeof skin !== 'string') {
      console.log('"skin" must be a valid non-empty string!');
      return;
    }

    if (save && 'localStorage' in window) {
      window.localStorage.setItem('webcardinal.skin', skin);
    }

    window.WebCardinal.state.skin = skin;
  }

  getSkin() {
    if (!isSkinEnabled()) {
      console.warn('WebCardinal skin is not set by your Application!');
      return;
    }

    return window.WebCardinal.state.skin;
  }

  applySkinForCurrentPage(skin) {
    if (!isSkinEnabled()) {
      console.warn('WebCardinal skin is not set by your Application!');
      return;
    }

    if (typeof skin !== 'string') {
      console.log('"skin" must be a valid non-empty string!');
      return;
    }

    window.WebCardinal.state.page.loader.skin = skin;
  }

  translate(translationChain) {
    if (!getTranslationsFromState()) {
      console.warn(
        [`Function "translate" must be called only when translations are enabled!`, `Check WebCardinal.state`].join(
          '\n',
        ),
      );
      return;
    }

    const skin = getSkinFromState();
    const pathname = getPathname();

    if (!this.translationModel) {
      console.warn(
        `No translations found for page: "${pathname}" (skins: "${skin}"${skin !== 'default' ? ' and "default"' : ''})`,
      );
      return translationChain;
    }

    if (translationChain.startsWith('$')) {
      translationChain = translationChain.slice(1);
    }
    const translation = getValueFromModelByChain(this.translationModel, translationChain);
    if (!translation) {
      console.warn(
        `No translations found for chain: "${translationChain}" (page: "${pathname}", skins: "${skin}"${
          skin !== 'default' ? ' and "default"' : ''
        })`,
      );
      return translationChain;
    }

    return translation;
  }

  getElementByTag(tag) {
    return this.element.querySelector(`[${TAG_ATTRIBUTE}="${tag}"]`);
  }

  getElementsByTag(tag) {
    return this.element.querySelectorAll(`[${TAG_ATTRIBUTE}="${tag}"]`);
  }

  querySelector(selector) {
    return this.element.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.element.querySelectorAll(selector);
  }

  getMainEnclaveDB(callback) {
    if (!isRequireAvailable()) {
      console.error('"this.getMainEnclaveDB" is available only inside an SSApp!');
      return undefined;
    }

    // eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
    const dbAPI = require('opendsu').loadAPI('db');
    dbAPI.getMainEnclaveDB(callback);
  }

  /**
   * @deprecated
   *
   * Use "this.model = <YOUR_MODEL>" instead
   */
  setModel(model) {
    console.warn(
      [
        `Function "setModel" is applied in a redundant manner and it is also deprecated.`,
        `This function will be removed in a future release`,
        `Use "this.model = <YOUR_MODEL>" instead`,
      ].join('\n'),
    );
    this.model = model;
  }

  /**
   * @deprecated
   */
  setLanguage() {
    console.warn(
      [
        `Function "setLanguage" is deprecated!`,
        'Use "setSkin" with a new skin if changing of the translations is desired',
      ].join('\n'),
    );
  }

  /**
   * @deprecated
   */
  setPreferredSkin(skin, { saveOption } = { saveOption: true }) {
    console.warn(
      [
        `Function "setPreferredSkin" is deprecated!`,
        `Use "setSkin" instead, "saveOptions" flag is now "save" (store your skin in localStorage).`,
      ].join('\n'),
    );
    this.setSkin(skin, { save: saveOption });
  }

  /**
   * @deprecated
   */
  getPreferredSkin() {
    console.warn([`Function "getPreferredSkin" is deprecated!`, `Use "getSkin" instead!`].join('\n'));
    return this.getSkin();
  }

  /**
   * @deprecated
   */
  changeSkinForCurrentPage(skin) {
    console.warn(
      [`Function "changeSkinForCurrentPage" is deprecated!`, `Use "applySkinForCurrentPage" instead!`].join('\n'),
    );
    this.applySkinForCurrentPage(skin);
  }

  /**
   * @deprecated
   */
  get DSUStorage() {
    if (!isRequireAvailable()) {
      console.error('"this.DSUStorage" is available only inside an SSApp!');
      return this._dsuStorage;
    }

    if (!this._dsuStorage) {
      // eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
      const { getDSUStorage } = require('opendsu').loadAPI('storage');
      this._dsuStorage = getDSUStorage();
    }

    return this._dsuStorage;
  }

  /**
   * @deprecated
   */
  set DSUStorage(dsuStorage) {
    console.warn('Overriding "this.DSUStorage" is not recommended!');

    this._dsuStorage = dsuStorage;
  }
}

export { Controller as C, PskBindableModel as P, proxifyModelProperty as p };
