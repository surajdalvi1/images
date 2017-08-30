/**
 * Created by pradeep on 17/4/17.
 */
var Contentstack = require("contentstack");
module.exports = exports = {
    port: 5000,
    // Contentstack Config
    contentstack: {
        api_key: 'blteae40eb499811073',
        access_token: 'bltb316e68dcc8bff50',
        environment:'dev'
    },
    host:'https://cdn.contentstack.io/v3',

    Stack:Contentstack.Stack({
        api_key: "blteae40eb499811073" ,
        access_token: "bltb316e68dcc8bff50",
        environment: "dev"
    })
};