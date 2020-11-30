const ParseError = require('../errors/ParseError');
const Endpoint = require('../Endpoint');
const assert = require('assert');

class RequestLine {

  static parse(data) {
    const parts = data.split(' ');
    if (parts.length !== 3) {
      throw new ParseError("Incorrect number of arguments in request line");
    }

    const [
      method,
      uri,
      protocol
    ] = parts;

    if (!Endpoint.METHODS.has(method)) {
      throw new ParseError(`Unsupported method ${method}`);
    }

    let url, fullUri;
    try {
      let fullUri = uri;
      if (uri.startsWith('/')) {
        fullUri = `ws://0.0.0.0${uri}`
      }
      url = new URL(fullUri);
    } catch(e) {
      throw new ParseError(`Unable to parse request URI:\n${fullUri}`);
    }

    return new RequestLine(
      method,
      url,
      protocol
    );
  }

  constructor(method, url, protocol) {
    assert(Endpoint.METHODS.has(method));
    assert(url instanceof URL);

    this.method = method;
    this.url = url;
    this.protocol = protocol;
  }
}

module.exports = RequestLine;