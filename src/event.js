rapid = require('rapid');

var Event = rapid.model('Event', {
      type        : { type: 'string', required: true }
    , client_id   : { type: 'string', required: true }
    , session_id  : { type: 'string', required: true }
    , url         : { type: 'string', required: true }
    , at          : { type: 'date'  , required: true }
    , page_x      : { type: 'number', required: true }
    , page_y      : { type: 'number', required: true }
    , target_node : { type: 'string', required: true }
    , target_id   : { type: 'string', required: true } 
});
