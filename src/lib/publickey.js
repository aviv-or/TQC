'use strict';
import JSUtil from './util/js'
import Hash from './crypto/hash'

import Network from './networks'
import _ from 'lodash'
import $ from './util/preconditions'
import Address from './address'
import ntru from 'ntrujs'
import asn1 from 'asn1.js'
import {toBitArray} from 'lib/polyfill'
import PrivateKey from './privatekey'

const ASN1PublicKey = asn1.define('ASN1PublicKey', function() {
  this.seq().obj(this.key('G').bitstr())
});

/**
 * Instantiate a PublicKey from a {@link PrivateKey}, `string`, or `Buffer`.
 *
 * There are two internal properties, `network` and `compressed`, that deal with importing
 * a PublicKey from a PrivateKey in WIF format. More details described on {@link PrivateKey}
 *
 * @example
 * ```javascript
 * // instantiate from a private key
 * var key = PublicKey(privateKey, true);
 *
 * // export to as a DER hex encoded string
 * var exported = key.toString();
 *
 * // import the public key
 * var imported = PublicKey.fromString(exported);
 * ```
 *
 * @param {string} data - The encoded data in various formats
 * @param {Object} extra - additional options
 * @param {Network=} extra.network - Which network should the address for this public key be for
 * @param {String=} extra.compressed - If the public key is compressed
 * @returns {PublicKey} A new valid instance of an PublicKey
 * @constructor
 */
function PublicKey(data, extra) {

  if (!(this instanceof PublicKey)) {
    return new PublicKey(data, extra);
  }

  $.checkArgument(data, 'First argument is required, please include public key data.');

  if (data instanceof PublicKey) {
    // Return copy, but as it's an immutable object, return same argument
    return data;
  }
  extra = extra || {};

  var info = this._classifyArgs(data, extra);

  JSUtil.defineImmutable(this, {
    buffer: info.buffer,
    compressed: info.compressed,
    network: info.network || Network.defaultNetwork
  });

  return this;
};

/**
 * Internal function to differentiate between arguments passed to the constructor
 * @param {*} data
 * @param {Object} extra
 */
PublicKey.prototype._classifyArgs = function(data, extra) {
  /* jshint maxcomplexity: 10 */
  var info = {
    compressed: _.isUndefined(extra.compressed) || extra.compressed
  };

  // detect type of data
  if (data.buffer) {
    info.buffer = data.buffer
    info.network = data.network
  } else if (typeof(data) === 'string') {
    info = PublicKey._transformDER(new Buffer(data, 'hex'));
  } else if (PublicKey._isBuffer(data)) {
    info = PublicKey._transformDER(data);
  } else if (PublicKey._isPrivateKey(data)) {
    info = PublicKey._transformPrivateKey(data);
  } else {
    throw new TypeError('First argument is an unrecognized data format.');
  }
  if (!info.network) {
    info.network = _.isUndefined(extra.network) ? undefined : Network.get(extra.network);
  }
  return info;
};

/**
 * Internal function to detect if an object is a {@link PrivateKey}
 *
 * @param {*} param - object to test
 * @returns {boolean}
 * @private
 */
PublicKey._isPrivateKey = function(param) {
  return param instanceof PrivateKey;
};

/**
 * Internal function to detect if an object is a Buffer
 *
 * @param {*} param - object to test
 * @returns {boolean}
 * @private
 */
PublicKey._isBuffer = function(param) {
  return (param instanceof Buffer) || (param instanceof Uint8Array);
};

/**
 * Internal function to transform a private key into a public key point
 *
 * @param {PrivateKey} privkey - An instance of PrivateKey
 * @returns {Object} An object with keys: point and compressed
 * @private
 */
PublicKey._transformPrivateKey = function(privkey) {
  $.checkArgument(PublicKey._isPrivateKey(privkey), 'Must be an instance of PrivateKey');

  const seed = privkey.bn
  console.log(131, new Buffer(seed))
  const pair = ntru.createKey(seed)
  const publicKey = pair.public

  const info = {}
  info.buffer = publicKey
  info.compressed = privkey.compressed
  info.network = privkey.network
  return info
}

/**
 * Internal function to transform DER into a public key point
 *
 * @param {Buffer} buf - An hex encoded buffer
 * @param {bool=} strict - if set to false, will loosen some conditions
 * @returns {Object} An object with keys: point and compressed
 * @private
 */
PublicKey._transformDER = function(buf, strict) {
  /* jshint maxstatements: 30 */
  /* jshint maxcomplexity: 12 */
  $.checkArgument(PublicKey._isBuffer(buf), 'Must be a hex buffer of DER encoded public key');
  const der = ASN1PublicKey.decode(buf, 'der')
  const data = der['G'].data

  // TODO
  return {
    buffer: data
  };
};

/**
 * Instantiate a PublicKey from a PrivateKey
 *
 * @param {PrivateKey} privkey - An instance of PrivateKey
 * @returns {PublicKey} A new valid instance of PublicKey
 */
PublicKey.fromPrivateKey = function(privkey) {
  $.checkArgument(PublicKey._isPrivateKey(privkey), 'Must be an instance of PrivateKey');
  var info = PublicKey._transformPrivateKey(privkey);
  return new PublicKey(info);
};

/**
 * Instantiate a PublicKey from a Buffer
 * @param {Buffer} buf - A DER hex buffer
 * @param {bool=} strict - if set to false, will loosen some conditions
 * @returns {PublicKey} A new valid instance of PublicKey
 */
PublicKey.fromDER = PublicKey.fromBuffer = function(buf, strict) {
  $.checkArgument(PublicKey._isBuffer(buf), 'Must be a hex buffer of DER encoded public key');
  var info = PublicKey._transformDER(buf, strict);
  return new PublicKey(info.buffer, {
    compressed: info.compressed
  });
};

/**
 * Instantiate a PublicKey from a DER hex encoded string
 *
 * @param {string} str - A DER hex string
 * @param {String=} encoding - The type of string encoding
 * @returns {PublicKey} A new valid instance of PublicKey
 */
PublicKey.fromString = function(str, encoding) {
  var buf = new Buffer(str, encoding || 'hex');
  var info = PublicKey._transformDER(buf);
  return new PublicKey(info);
};

/**
 * Check if there would be any errors when initializing a PublicKey
 *
 * @param {string} data - The encoded data in various formats
 * @returns {null|Error} An error if exists
 */
PublicKey.getValidationError = function(data) {
  var error;
  try {
    /* jshint nonew: false */
    new PublicKey(data);
  } catch (e) {
    error = e;
  }
  return error;
};

/**
 * Check if the parameters are valid
 *
 * @param {string} data - The encoded data in various formats
 * @returns {Boolean} If the public key would be valid
 */
PublicKey.isValid = function(data) {
  return !PublicKey.getValidationError(data);
};

/**
 * @returns {Object} A plain object of the PublicKey
 */
PublicKey.prototype.toObject = PublicKey.prototype.toJSON = function toObject() {
  return {
    buffer: this.buffer,
    compressed: this.compressed
  };
};

/**
 * Will output the PublicKey to a DER Buffer
 *
 * @returns {Buffer} A DER hex encoded buffer
 */
PublicKey.prototype.toBuffer = function() {
  return this.buffer
};

PublicKey.prototype.toDER = function () {
  let buffer = this.buffer
  return ASN1PublicKey.encode({
    G: {
      data: buffer,
      unused: 0
    }
  }, 'der')
}

    /**
 * Will return a sha256 + ripemd160 hash of the serialized public key
 * @see https://github.com/bitcoin/bitcoin/blob/master/src/pubkey.h#L141
 * @returns {Buffer}
 */
PublicKey.prototype._getID = function _getID() {
  return Hash.sha256ripemd160(this.toBuffer());
};

/**
 * Will return an address for the public key
 *
 * @param {String|Network=} network - Which network should the address be for
 * @returns {Address} An address generated from the public key
 */
PublicKey.prototype.toAddress = function(network) {
  return Address.fromPublicKey(this, network || this.network);
};

/**
 * Will output the PublicKey to a DER encoded hex string
 *
 * @returns {string} A DER hex encoded string
 */
PublicKey.prototype.toString = function() {
  return this.toDER().toString('hex');
};

/**
 * Will return a string formatted for the console
 *
 * @returns {string} Public key
 */
PublicKey.prototype.inspect = function() {
  return '<PublicKey: ' + this.toString() +
    (this.compressed ? '' : ', uncompressed') + '>';
};


export default PublicKey;
