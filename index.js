var through = require('through2');
var falafel = require('falafel');
var config = require('config'); // FIXME hard reload this each time in order to support `watchify`
var util = require('util');

module.exports = function(file) {
  if (!/\.(js|jsx|coffee)$/.test(file)) return through();

  var data = '';
  var modified = false;

  return through(function write(chunk, enc, next) {
    data += chunk.toString('utf8');
    next();
  }, function end(done) {
    this.push(String(falafel(data, function(node) {
      if (node.name === 'require' &&
        node.parent &&
        node.parent.arguments &&
        node.parent.arguments.length &&
        node.parent.arguments[0].value === 'config') {
        if (node.parent.parent.type === 'VariableDeclarator') {
          node.parent.update(util.format('(%s)(%s);', function(
            props) {
            var self = {};
            var _getByPropPath = function(o, s) {
              // http://stackoverflow.com/a/6491621
              s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
              s = s.replace(/^\./, ''); // strip a leading dot
              var a = s.split('.');
              for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                  o = o[k];
                } else {
                  return;
                }
              }
              return o;
            };

            self.get = function(a) {
              return _getByPropPath(props, a);
            };

            return self;
          }.toString(), JSON.stringify(config)));
          modified = true;
        }
      }
    })));
    this.push(null);
    done();
  });
};
