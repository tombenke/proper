#!/usr/bin/env node
/**
 * Property graph processing engine
 */
(function() {
    var verbose = false;
    var fs = require('fs');
    var jsyaml = require( 'js-yaml' );
    var engine = require('../processor.js');

    /**
     * Setup the configuration for the graph processor engine
     * @return {Object} The configuration object
     */
    var getConfiguration = function () {
        var pathSep = require('path').sep;
        var inFileName = process.cwd() + pathSep;

        if ( process.argv.length < 3 ) {
            console.log('ERROR: Too few arguments!');
            process.exit();
        } else {
            if ( process.argv[2][0] === pathSep ) {
                inFileName = process.argv[2];
            } else {
                inFileName += process.argv[2];
            }
        }

        console.log( 'input file: ', inFileName );
        var config = require( inFileName );

        // TODO: validate config

        for ( var procs in config ) {
            if ( config.hasOwnProperty(procs) ) {
                config[procs].forEach(function(proc){
                    if ( proc.hasOwnProperty('fileName') ) {
                        proc.fileName = process.cwd() + pathSep + proc.fileName;
                    }
                });
            }
        }
        return config;
    };

    // Auto-start the engine
    engine.run( getConfiguration() );
})();
