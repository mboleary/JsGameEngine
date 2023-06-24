/**
 * Environment Variable Schema for Convict
 */

const schema = {
    env: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    // ip: {
    //     doc: 'The IP address to bind.',
    //     format: 'ipaddress',
    //     default: '127.0.0.1',
    //     env: 'IP_ADDRESS',
    // },
    port: {
        doc: 'The port to bind.',
        format: 'port',
        default: 8080,
        env: 'PORT',
        arg: 'port'
    },
};

export default schema;