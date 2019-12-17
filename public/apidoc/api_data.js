define({ "api": [
  {
    "type": "post",
    "url": "/v1/socket/broadcast",
    "title": "broadcast",
    "name": "BroadcastMessage",
    "group": "socket",
    "version": "1.0.0",
    "description": "<p>Sends a message to the web-socket for all users in group.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event",
            "description": "<p>Optional Name of the event, default &quot;message&quot;.</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "message",
            "description": "<p>Mandatory Message as JSON.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the response.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message about the performed action.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"ok\",\n  \"message\": \"message sent\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ConnectionNotFound",
            "description": "<p>The id of the User was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>A parameter was not passed.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"ConnectionNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"The parameter `message` was not transmitted\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/socket/v1/api.js",
    "groupTitle": "socket"
  },
  {
    "type": "get",
    "url": "/v1/socket/connections",
    "title": "connections",
    "name": "GetConnections",
    "group": "socket",
    "version": "1.0.0",
    "description": "<p>Returns the active client connections.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the response.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "connections",
            "description": "<p>An array containing a ids active connections.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"ok\",\n    \"connections\": [\n        \"2362509\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/socket/v1/api.js",
    "groupTitle": "socket"
  },
  {
    "type": "post",
    "url": "/v1/socket/send",
    "title": "send",
    "name": "SendMessage",
    "group": "socket",
    "version": "1.0.0",
    "description": "<p>Sends a message to the web-socket by connection_id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "connection_id",
            "description": "<p>Mandatory Id of the connection_id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "event",
            "description": "<p>Optional Name of the event, default &quot;message&quot;.</p>"
          },
          {
            "group": "Parameter",
            "type": "JSON",
            "optional": false,
            "field": "message",
            "description": "<p>Mandatory Message as JSON.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Status of the response.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The message about the performed action.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"ok\",\n  \"message\": \"message sent\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "ConnectionNotFound",
            "description": "<p>The id of the User was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>A parameter was not passed.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"ConnectionNotFound\",\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Not Found\n{\n  \"status\": \"error\",\n  \"message\": \"The parameter `connection_id` was not transmitted\",\n}",
          "type": "json"
        }
      ]
    },
    "filename": "api/socket/v1/api.js",
    "groupTitle": "socket"
  }
] });
