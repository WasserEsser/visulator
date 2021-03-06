'use strict';

var size    = require('../size')
  , hex     = require('../hexstring')
  , debug   = require('debug')('cpu')
  , debugCF = require('debug')('CF')

var MAX = {};
MAX[size.BYTE]  = 0xff
MAX[size.WORD]  = 0xffff
MAX[size.DWORD] = 0xffffffff

function ArithmeticLogicUnit() {
  if (!(this instanceof ArithmeticLogicUnit)) return new ArithmeticLogicUnit();
  this.carried = false;
}

module.exports = ArithmeticLogicUnit;
var proto = ArithmeticLogicUnit.prototype;

proto.dec = function dec(v, nbytes) {
  return this._checkOverflow(--v, nbytes);
}

proto.inc = function inc(v, nbytes) {
  return this._checkOverflow(++v, nbytes)
}

proto.add = function add(dst, src, nbytes) {
  return this._checkOverflow(dst + src, nbytes)
}

proto.sub = function and(dst, src, nbytes) {
  return this._checkOverflow(dst - src, nbytes)
}

proto.and = function and(dst, src, nbytes) {
  return this._checkOverflow(dst & src, nbytes)
}

proto.or = function or(dst, src, nbytes) {
  var res = (dst | src) >>> 0;
  return this._checkOverflow(res, nbytes)
}

proto.xor = function xor(dst, src, nbytes) {
  var res = (dst ^ src) >>> 0;
  return this._checkOverflow(res, nbytes)
}

/**
 * NOT inverts each bit of its operand which
 * returns the one's complement.
 *
 * @name alu::not
 * @param {Number} src value of source
 * @param {Number} nbytes size of the destination
 * @return {Number} inverted result
 */
proto.not = function not(src, nbytes) {
  var res = (~src) >>> 0;
  return this._checkOverflow(res, nbytes)
}

/**
 * NEG subtracts the destination operand from 0, and returns the result
 * in the destination. This effectively produces the two's complement
 * of the operand.
 *
 * @name alu::neg
 * @function
 * @param {Number} src value of source
 * @param {Number} nbytes size of the destination
 * @return {Number} negated result
 */
proto.neg = function neg(src, nbytes) {
  return this.sub(0x0, src, nbytes)
}

proto._checkOverflow = function _checkOverflow(x, nbytes) {
  var max = MAX[nbytes];

  debugCF({ val: hex(x), bytes: nbytes, max: hex(max) })

  if (x <= max && x >= 0) {
    this.carried = false;
    return x
  }
  this.carried = true
  return x & max;
}
