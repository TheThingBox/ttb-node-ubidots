module.exports = function(RED) {
  var request = require('request');

  function postUbidots(variable_id, value, auth_token, timestamp) {
    request.post({
      headers: {
        'content-type': 'application/json',
        'X-Auth-Token': auth_token,
      },
      url: `http://things.ubidots.com/api/v1.6/variables/${variable_id}/values`,
      body: JSON.stringify({
        value: value,
        timestamp: timestamp
      },
    }, function(error, response, body) {
      console.log(body);
    });
  }

  function UbidotsNode(n) {
    RED.nodes.createNode(this, n);
    this.variable_id = n.variable_id
    this.auth_token = n.auth_token
    var node = this;

    this.on("input", function(msg) {
      var variable_id = msg.variable_id || node.variable_id;
      var auth_token = msg.auth_token || node.auth_token;
      var value = msg.payload;
      var timestamp = msg.timestamp || Date.now();

      if(typeof value === "string" || typeof value === "number"){
        value = parseFloat(value);
      }

      postUbidots(variable_id, value, auth_token, timestamp);
    });
  }
  RED.nodes.registerType("ubidots", UbidotsNode);
}
