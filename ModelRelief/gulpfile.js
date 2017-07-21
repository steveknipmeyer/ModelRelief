// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

'use strict';

// Gulp
var gulp         = require('gulp');
var gutil        = require('gulp-util');

// Node.js
var beep         = require('beepbeep');
var fs           = require('fs');
var robocopy     = require('robocopy');
var runSequence  = require('run-sequence');

var siteConfig = new (function() {
 
    this.nodeModulesRoot = './node_modules/';                      
    this.wwwRoot         = './wwwroot/';                      

    this.cssRoot         = this.wwwRoot + 'css/';
    this.jsRoot          = this.wwwRoot + 'js/';
    this.libRoot         = this.wwwRoot + 'lib/';
 })();
 
var encodingAscii          = {encoding: 'ascii'};
var encodingUnicode        = {encoding: 'utf8'};

var onError = function (err) {
    beep([0]);
    gutil.log(gutil.colors.red(err));
};

//-----------------------------------------------------------------------------
//  Utilities
//-----------------------------------------------------------------------------
/// <summary>
/// Returns the lines in an array.
/// </summary>
function readFile(fileName, stripByteOrderMark) {
    var lines = [];
    
    lines = fs.readFileSync(fileName).toString();
    if (stripByteOrderMark)
        lines = lines.replace(/^\uFEFF/, '');

    lines = lines.split('\n');
   
    return lines;
}

/// <summary>
/// Strips the EOL characters from the lines in an array.
/// </summary>
function stripEOLCharacters(lines) {
        var iLine = 0;

    // strip end of line characters
    for (iLine = 0; iLine < lines.length; iLine++) {

        lines[iLine] = lines[iLine].replace('\n', '');
        lines[iLine] = lines[iLine].replace('\r', '');
    }
    return lines;
}

/// <summary>
/// Deletes a file.
/// </summary>
function deleteFile (fileName) {

    if (fs.existsSync(fileName))
        fs.unlinkSync(fileName);
    }

/// <summary>
/// Copies a file.
/// https://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js
/// </summary>
function copyFile(file, sourceFolder, targetFolder, callBack) {
    
    var callBackCalled = false;
    var source = sourceFolder + file;
    var target = targetFolder + file;

    if (!fs.existsSync(source) || !fs.existsSync(source)) {
        onError(source + ' does not exist.');
        return;
        }

    if (!callBack)
        callBack = onError;

    var readStream = fs.createReadStream(source);
    readStream.on("error", function(error) {
        done(error);
    });

    var writeStream = fs.createWriteStream(target);
    writeStream.on("error", function(error) {
        done(error);
    });

    readStream.pipe(writeStream);

    function done(error) {
        if (callBack && !callBackCalled) {
            callBack(error);

        callBackCalled = true;
      }
    }
}
/// <summary>
/// Appends lines to a file.
/// </summary>
function appendFile (fileName, lines, encoding) {
    var iLine;

    for (iLine = 0; iLine < lines.length; iLine++) {
        fs.appendFileSync(fileName, lines[iLine], encoding);
    }
}

//-----------------------------------------------------------------------------
//  Build Tasks
//-----------------------------------------------------------------------------

/// <summary>
/// Populate wwwroot with NPM content
/// </summary>
gulp.task('copyNPM', function () {
    
    // Bootstrap
    let bootstrapFolder = siteConfig.nodeModulesRoot + 'bootstrap/dist/css/';
    copyFile('bootstrap.css',     bootstrapFolder, siteConfig.cssRoot);
    copyFile('bootstrap.css.map', bootstrapFolder, siteConfig.cssRoot);
    
    // jquery
    let jqueryFolder = siteConfig.nodeModulesRoot + 'jquery/dist/'
    copyFile('jquery.js', jqueryFolder, siteConfig.libRoot)

    // jquery-validation
    let jqueryValidationFolder = siteConfig.nodeModulesRoot + 'jquery-validation/dist/'
    copyFile('jquery.validate.js', jqueryValidationFolder, siteConfig.libRoot)

    //jquery-validation-unobtrusive
    let jqueryValidationUobtrusiveFolder = siteConfig.nodeModulesRoot + 'jquery-validation-unobtrusive/'
    debugger;
    copyFile('jquery.validate.unobtrusive.js', jqueryValidationUobtrusiveFolder, siteConfig.libRoot)

    // three/build
    let threeBuildFolder = siteConfig.nodeModulesRoot + 'three/build/';
    copyFile('three.js', threeBuildFolder, siteConfig.libRoot + 'threejs/')

    // three/examples/js
    let threeExamplesFolder = siteConfig.nodeModulesRoot + 'three/examples/js/';
    copyFile('Detector.js',             threeExamplesFolder,                siteConfig.libRoot + 'threejs/');
    copyFile('TrackballControls.js',    threeExamplesFolder + 'controls/',  siteConfig.libRoot + 'threejs/');
    copyFile('dat.gui.min.js',          threeExamplesFolder + 'libs/',      siteConfig.libRoot + 'threejs/');
    copyFile('MTLLoader.js',            threeExamplesFolder + 'loaders/',   siteConfig.libRoot + 'threejs/');
    copyFile('OBJLoader2.js',           threeExamplesFolder + 'loaders/',   siteConfig.libRoot + 'threejs/');
    copyFile('WWOBJLoader2.js',         threeExamplesFolder + 'loaders/',   siteConfig.libRoot + 'threejs/');

    // require.js
    let requirejsFolder = siteConfig.nodeModulesRoot + 'requirejs/';
    copyFile('require.js',  requirejsFolder, siteConfig.libRoot);
});
/// <summary>
/// Debug task
/// </summary>
gulp.task('debug', function () {
  console.log (siteConfig.libRoot);
});

/// <summary>
/// Default build task
/// </summary>
gulp.task('default', function () {
  runSequence('copyNPM');
});

//-----------------------------------------------------------------------------
//  Watch and Build Tasks
//-----------------------------------------------------------------------------
