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

var wwwRoot                = './wwwroot/';                      
var nodeModulesRoot        = './node_modules/';                      
var cssRoot                = wwwRoot + 'css/';                      
var jsRoot                 = wwwRoot + 'js/';                      
var libRoot                = wwwRoot + 'lib/';                      


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
//  WEBSITE TASKS
//-----------------------------------------------------------------------------

/// <summary>
/// Populate wwwroot with NPM content
/// </summary>
gulp.task('copyNPM', function () {
    

    // Bootstrap
    let bootstrapFolder = nodeModulesRoot + 'bootstrap/dist/css/';
    copyFile('bootstrap.css',     bootstrapFolder, cssRoot);
    copyFile('bootstrap.css.map', bootstrapFolder, cssRoot);

    // jquery
    let jqueryFolder = nodeModulesRoot + 'jquery/dist/'
    copyFile('jquery.js', jqueryFolder, libRoot)

    // jquery-validation
    let jqueryValidationFolder = nodeModulesRoot + 'jquery-validation/dist/'
    copyFile('jquery.validate.js', jqueryValidationFolder, libRoot)

    //jquery-validation-unobtrusive
    let jqueryValidationUobtrusiveFolder = nodeModulesRoot + 'jquery-validation-unobtrusive/'
    debugger;
    copyFile('jquery.validate.unobtrusive.js', jqueryValidationUobtrusiveFolder, libRoot)
});

/// Default build task
/// </summary>
gulp.task('default', function (customBuild) {
  runSequence('copyNPM', customBuild);
});

//-----------------------------------------------------------------------------
//  Watch and Build Tasks
//-----------------------------------------------------------------------------
