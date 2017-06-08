'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Recorder = function (_Component) {
  _inherits(Recorder, _Component);

  function Recorder() {
    _classCallCheck(this, Recorder);

    return _possibleConstructorReturn(this, (Recorder.__proto__ || Object.getPrototypeOf(Recorder)).apply(this, arguments));
  }

  _createClass(Recorder, [{
    key: 'start',
    value: function start() {
      this.mediaRecorder.start();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.mediaRecorder.stop();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.mediaRecorder.pause();
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.mediaRecorder.resume();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia;

      if (navigator.getUserMedia && window.MediaRecorder) {
        var constraints = { audio: true };
        this.chunks = [];
        var _props = this.props,
            blobOpts = _props.blobOpts,
            onStop = _props.onStop,
            onError = _props.onError,
            mediaOpts = _props.mediaOpts,
            onPause = _props.onPause,
            onResume = _props.onResume,
            onStart = _props.onStart,
            gotStream = _props.gotStream;


        var onErr = function onErr(err) {
          console.warn(err);
          if (onError) onError(err);
        };

        var onSuccess = function onSuccess(stream) {
          _this2.mediaRecorder = new window.MediaRecorder(stream, mediaOpts || {});

          _this2.mediaRecorder.ondataavailable = function (e) {
            _this2.chunks.push(e.data);
          };

          _this2.mediaRecorder.onstop = function (e) {
            var blob = new window.Blob(_this2.chunks, blobOpts || { type: 'audio/wav' });
            _this2.chunks = [];
            onStop(blob);
          };

          _this2.mediaRecorder.onerror = onErr;
          if (onPause) _this2.mediaRecorder.onpause = onPause;
          if (onResume) _this2.mediaRecorder.onresume = onResume;
          if (onStart) _this2.mediaRecorder.onstart = onStart;
          _this2.stream = stream;
          if (gotStream) gotStream(stream);
        };

        navigator.getUserMedia(constraints, onSuccess, onErr);
      } else {
        console.warn('Audio recording APIs not supported by this browser');
        var onMissingAPIs = this.props.onMissingAPIs;

        if (onMissingAPIs) {
          onMissingAPIs(navigator.getUserMedia, window.MediaRecorder);
        } else {
          window.alert('Your browser doesn\'t support native microphone recording. For best results, we recommend using Google Chrome or Mozilla Firefox to use this site.');
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.command && this.props.command !== 'none' && prevProps.command !== this.props.command) {
        this[this.props.command]();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.onUnmount) this.props.onUnmount(this.stream);
    }
  }, {
    key: 'render',
    value: function render() {
      return false;
    }
  }]);

  return Recorder;
}(_react.Component);

Recorder.propTypes = {
  command: _propTypes2.default.oneOf(['start', 'stop', 'pause', 'resume', 'none']),
  onStop: _propTypes2.default.func.isRequired,
  onMissingAPIs: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  onPause: _propTypes2.default.func,
  onStart: _propTypes2.default.func,
  onResume: _propTypes2.default.func,
  onUnmount: _propTypes2.default.func,
  gotStream: _propTypes2.default.func,
  blobOpts: _propTypes2.default.object,
  mediaOpts: _propTypes2.default.object
};

exports.default = Recorder;