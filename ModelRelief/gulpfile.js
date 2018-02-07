// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//

/*
https://stackoverflow.com/questions/40033298/how-to-debug-a-gulp-task
Insert the debugger statement at the target line. Run DebugGulp.bat.
    debugger;
Documents\bin\DebugGulp.bat
*/

'use strict';
// Gulp
var gulp         = require('gulp');
var eol          = require('gulp-eol');
var gutil        = require('gulp-util');
var exec         = require('child_process').exec;
var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');
var ts           = require('gulp-typescript');

// Node.js
var beep         = require('beepbeep');
var browserSync  = require('browser-sync');
var fs           = require('fs');
var path         = require('path');
var robocopy     = require('robocopy');
var runSequence  = require('run-sequence');

var sourceConfig = new function() {
 
    this.sourceRoot     = './';                
    this.scriptsRoot    = this.sourceRoot + 'Scripts/';
      
    this.shaders        = this.scriptsRoot + 'Shaders/';
 }();

var siteConfig = new function() {
 
    this.wwwRoot         = './wwwroot/';                      
    this.nodeModulesRoot = './node_modules/';                      

    this.cssRoot         = this.wwwRoot + 'css/';
    this.jsRoot          = this.wwwRoot + 'js/';
    this.libRoot         = this.wwwRoot + 'lib/';
 }();
 
var encodingAscii          = {encoding: 'ascii'};
var encodingUnicode        = {encoding: 'utf8'};
var EOL                    = require('os').EOL;

var onError = function (err) {
    beep([0]);
    gutil.log(gutil.colors.red(err));
};

var tsProject = ts.createProject('tsconfig.json');

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
//  Shader Tasks
//-----------------------------------------------------------------------------

/// <summary>
/// Generates the composite Shaders.js JavaScript file from the individual .glsl source files.
/// </summary>
function generateShaders() {
    var glslSourceFolder    = sourceConfig.shaders,
        shaderTemplateFile  = 'ShadersTemplate.js',
        shaderFile          = 'shaders.js',
        shaderOutputFolder  = siteConfig.jsRoot,
        shaderFilePath      = shaderOutputFolder + shaderFile,
        glslFiles           = [],
        allShaderLines      = [];
    
    allShaderLines = readFile(glslSourceFolder + shaderTemplateFile, true);

    glslFiles = fs.readdirSync(glslSourceFolder);
    glslFiles.forEach(appendShader);

    deleteFile (shaderFilePath);
    appendFile(shaderFilePath, allShaderLines, encodingAscii);

    // EOL conversion to native OS
    gulp.src(shaderFilePath)
        .pipe(eol())
        .pipe(gulp.dest(shaderOutputFolder));

    /// <summary>
    /// Appends a .glsl source file to the output file.
    /// </summary>
    function appendShader(fileName) {
        var shaderLine      = '',
            shaderName      = '',
            thisShaderLines = [],
            iLine           = 0;

        if (path.extname(fileName) !== '.glsl')
            return;

        shaderName = path.basename(fileName, '.glsl');
        thisShaderLines = readFile(glslSourceFolder + fileName, true);
        thisShaderLines = stripEOLCharacters(thisShaderLines);

        shaderLine = 'MR.shaderSource["' + shaderName + '"] = "';
        for (iLine = 0; iLine < thisShaderLines.length; iLine++)
            shaderLine += thisShaderLines[iLine] + '\\n';

        shaderLine += '";';
        allShaderLines.push(shaderLine);
        allShaderLines.push('\n');

//      console.log(allShaderLines);
    }
}

//-----------------------------------------------------------------------------
//  Build Tasks
//-----------------------------------------------------------------------------

/// <summary>
/// Populate wwwroot with NPM content
/// </summary>
gulp.task('copyNPM', function () {

    // FOLDERS

    // Bootstrap
    let subFolder         = 'bootstrap/dist/';
    let sourceFolder      = siteConfig.nodeModulesRoot + subFolder;
    let destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // jquery
    subFolder         = 'jquery/dist/';
    sourceFolder      = siteConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // jquery-validation
    subFolder         = 'jquery-validation/dist/';
    sourceFolder      = siteConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // FILES

    //jquery-validation-unobtrusive
    subFolder         = 'jquery-validation-unobtrusive/';
    sourceFolder      = siteConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'jquery.validate.unobtrusive.js']).pipe(gulp.dest(destinationFolder ));

    // threejs
    subFolder         = 'threejs/';
    sourceFolder      = siteConfig.nodeModulesRoot + 'three/build/';
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'three.js']).pipe(gulp.dest(destinationFolder ));

    // three/examples/js
    subFolder         = 'threejs/';
    sourceFolder      = siteConfig.nodeModulesRoot + 'three/examples/js/'; 
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'Detector.js']).pipe(gulp.dest(destinationFolder ));
    gulp.src([sourceFolder + 'libs/' + 'dat.gui.min.js']).pipe(gulp.dest(destinationFolder ));

    // requirejs
    subFolder         = 'requirejs/';
    sourceFolder      = siteConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'require.js']).pipe(gulp.dest(destinationFolder ));

    // chai assertion library
    subFolder         = 'chai/';
    sourceFolder      = siteConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'chai.js']).pipe(gulp.dest(destinationFolder ));
});

/// <summary>
/// Assemble shader file from .glsl components.
/// </summary>
gulp.task('buildShaders', function() {
    generateShaders();
});

/// <summary>
/// Compile shaders and reload the browser.
/// </summary>
gulp.task('buildShadersReload', function () {

    runSequence('buildShaders', 'reload');
});

/// <summary>
/// Compile TypeScript
/// The TypeScript compiler is invoked through the Windows path. 
/// This is initialized in the development shell to the desired TypeScript compiler version.
/// "C:\Program Files (x86)\Microsoft SDKs\TypeScript\2.4""
/// </summary>
gulp.task('compileTypeScriptExec', function (callback) {
  exec('tsc.exe', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

/// <summary>
/// Compile TypeScript
/// The TypeScript compiler is invoked through the npm-installed version of node.
/// </summary>
gulp.task('compileTypeScript', function () {

    // N.B. Errors are emitted twice.
    // https://github.com/ivogabe/gulp-typescript/issues/438
    let beepSounded = false;
    let tsResult = tsProject.src() 
        .pipe(sourcemaps.init())        // sourcemaps will be generated 
        .pipe(tsProject())
        .on('error', function (err) {
            // N.B. called after <every> compilation error...
            if (!beepSounded)
                beep();                    
           beepSounded = true; 
        }
    );

    return tsResult.js
        .pipe(sourcemaps.write())       // sourcemaps are added to the .js file 
        .pipe(gulp.dest(''));
});

/// <summary>
/// Compile TypeScript and reload the browser.
/// </summary>
gulp.task('compileTypeScriptReload', function () {

    runSequence('compileTypeScript', 'reload');
});

/// <summary> 
/// Test task.
/// </summary> 
gulp.task('test', function () {
    beep();
});
  
/// <summary> 
/// Default build task
/// </summary> 
gulp.task('default', function () {
  runSequence('copyNPM', 'buildShaders');
});

//-----------------------------------------------------------------------------
//  Watch and Build Tasks
//-----------------------------------------------------------------------------
/// <summary>
/// Trigger a browser-sync reload.
/// </summary>
gulp.task ('reload', function() {
    browserSync.reload();
});

/// <summary>
/// Launch development browser-sync.
/// Watch development files for changes and reload.
/// </summary>
gulp.task('serve', function () {

  browserSync({
    notify: true,
    
    proxy: {

        target: "localhost:60655/Models/Viewer/1"
    }
//  browser: 'google chrome canary'
//  Canary    
//  browser: "C:/Users/Steve Knipmeyer/AppData/Local/Google/Chrome SxS/Application/chrome.exe"
  });

  gulp.watch([sourceConfig.shaders + '*.glsl'],                   ['buildShadersReload']);
  gulp.watch([sourceConfig.scriptsRoot + '**/*.ts'],              ['compileTypeScriptReload']);
  gulp.watch([siteConfig.cssRoot + '**/*.css'],                   ['reload']);
});
