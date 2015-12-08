var Hapi = require('hapi');
var bucker = require('bucker');
var Twilio = require('twilio');
var config = require('./config');

var server = new Hapi.Server();
server.connection({ port: 3000 });

var logger = bucker.createLogger({level: config.logging.level});

server.register(require('inert'), function (err) {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'build'
            }
        }
    });

    server.route({ method: 'POST', path: '/twilml/outgoing/voice', handler: function(request, reply){
        logRequest(request);
        var twilml = new Twilio.TwimlResponse();
        twilml.dial(request.payload.To, {callerId: request.payload.From});
        var response = reply(twilml.toString());
        response.type('application/xml');
      }
    });

    server.route({ method: 'POST', path: '/twilml/outgoing/fallback', handler: function(request, reply){
        logRequest(request);
        reply();
      }
    });

    server.route({ method: 'POST', path: '/twilml/incoming/voice', handler: function(request, reply){
        logRequest(request);
        var twilml = new Twilio.TwimlResponse();
        twilml.dial({callerId: request.payload.From}, function(){
            this.client(config.twilio.client_id);
        })
        var response = reply(twilml.toString());
        response.type('application/xml');
      }
    });


    server.route({
        method: 'GET',
        path: '/capability_token',
        handler: function (request, reply) {
            var capability = new Twilio.Capability(config.twilio.account_sid, config.twilio.auth_token);
            capability.allowClientIncoming(config.twilio.client_id);
            capability.allowClientOutgoing(config.twilio.app_sid);

            var token = capability.generate();
            reply(token);
        }
    });
});

var logRequest = function(log){
  logger.debug(log);
}

server.start(function () {
    logger.info('Server running at:', server.info.uri);
});
