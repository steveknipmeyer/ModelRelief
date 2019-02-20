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
var uglify       = require('gulp-uglify');
var pump         = require('pump');

// Node.js
var beep         = require('beepbeep');
var browserSync  = require('browser-sync');
var fs           = require('fs');
var path         = require('path');
var robocopy     = require('robocopy');
var runSequence  = require('run-sequence');

var sourceConfig = new function() {

    this.sourceRoot     = './ModelRelief/';

    this.cssRoot        = this.sourceRoot + 'CSS/';
    this.imagesRoot     = this.sourceRoot + 'Delivery/Images/';
    this.htmlRoot       = this.sourceRoot + 'Delivery/Html/';
    this.scriptsRoot    = this.sourceRoot + 'Scripts/';
    this.shaders        = this.scriptsRoot + 'Shaders/';

    this.nodeModulesRoot = './node_modules/';
    this.vendorRoot      = './ModelRelief/Vendor/';
    this.mdbRoot         = this.vendorRoot + 'MDBootstrap/MDB-Gulp-Pro_4.7.1/';
    this.mdbRootDist     = this.mdbRoot + 'dist/';
 }();

var siteConfig = new function() {

    this.wwwRoot         = sourceConfig.sourceRoot + './wwwroot/';

    this.cssRoot         = this.wwwRoot + 'css/';
    this.imagesRoot      = this.wwwRoot + 'images/';
    this.jsRoot          = this.wwwRoot + 'js/';
    this.libRoot         = this.wwwRoot + 'lib/';
 }();

var encodingAscii          = {encoding: 'ascii'};
var encodingUnicode        = {encoding: 'utf8'};
var EOL                    = require('os').EOL;

var tsProject = ts.createProject(sourceConfig.sourceRoot + 'tsconfig.json');

//-----------------------------------------------------------------------------
//  Utilities
//-----------------------------------------------------------------------------
/// <summary>
/// Error handler.
/// </summary>
var onError = function (err) {
    beep([0]);
    gutil.log(gutil.colors.red(err));
};

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
function appendFile (fileName, lines, encoding, addEol) {
    var iLine;

    for (iLine = 0; iLine < lines.length; iLine++) {
        var lineEnding = addEol ? EOL : '';
        fs.appendFileSync(fileName, lines[iLine] + lineEnding, encoding);
    }
}
/// <summary>
/// Performs OS EOL processing on a file.
/// </summary>
function processEOL(fileName){

    var folder = path.dirname(fileName);
    gulp.src(fileName)
        .pipe(eol())
        .pipe(gulp.dest(folder));
}

/// <summary>
/// Performs OS EOL processing on a file.
/// </summary>
function createDirectory(dir) {

    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
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
        declarationLines    = [],
        shaderLines      = [];

    declarationLines = readFile(glslSourceFolder + shaderTemplateFile, true);
    shaderLines = [];

    glslFiles = fs.readdirSync(glslSourceFolder);
    glslFiles.forEach(appendShader);

    // ensure output folder exists
    createDirectory(shaderOutputFolder);
    deleteFile (shaderFilePath);

    appendFile(shaderFilePath, declarationLines, encodingAscii, true);
    appendFile(shaderFilePath, shaderLines, encodingAscii, false);

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
        shaderLines.push(shaderLine);
        shaderLines.push('\n');

//      console.log(allShaderLines);
    }
}

//-----------------------------------------------------------------------------
//  Build Tasks
//-----------------------------------------------------------------------------
/// <summary>
/// Create the output structure for wwwroot.
/// </summary>
gulp.task('createWWWRoot', function () {
    createDirectory(siteConfig.wwwRoot);
});

/// <summary>
/// Populate wwwroot with CSS content
/// </summary>
gulp.task('buildCSS', function () {

    // FOLDERS

    // CSS
    let sourceFolder      = sourceConfig.cssRoot;
    let destinationFolder = siteConfig.cssRoot;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // FILES
});

/// <summary>
/// Minimize JavaScript files.
/// https://stackoverflow.com/questions/31579421/gulp-src-not-reading-required-json-files-array-values
/// </summary>
gulp.task('compressJS', function (callBack) {
    pump([
        gulp.src([
            `${siteConfig.jsRoot}modelrelief.js`,
            `${siteConfig.jsRoot}shaders.js`,
            `${siteConfig.libRoot}chai/chai.js`
        ],
        {base: siteConfig.wwwRoot}),
        uglify(),
        rename({ suffix: '.min' }),
        gulp.dest(siteConfig.wwwRoot)
      ],
      callBack
    );
});

/// <summary>
/// Populate wwwroot with static content
/// </summary>
gulp.task('buildStaticContent', function () {

    // FOLDERS

    // Images
    let sourceFolder      = sourceConfig.imagesRoot;
    let destinationFolder = siteConfig.imagesRoot;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // FILES
    sourceFolder      = sourceConfig.htmlRoot;
    destinationFolder = siteConfig.wwwRoot;
    gulp.src([sourceFolder + 'workbench.html']).pipe(gulp.dest(destinationFolder ));
});

/// <summary>
/// Populate wwwroot with NPM content
/// </summary>
gulp.task('copyNPM', function () {

    // FOLDERS

    // Bootstrap
    let subFolder         = 'bootstrap/dist/';
    let sourceFolder      = sourceConfig.nodeModulesRoot + subFolder;
    let destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // jquery
    subFolder         = 'jquery/dist/';
    sourceFolder      = sourceConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // jquery-validation
    subFolder         = 'jquery-validation/dist/';
    sourceFolder      = sourceConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + '**/*']).pipe(gulp.dest(destinationFolder ));

    // FILES
    let fileList = [];

    //jquery-validation-unobtrusive
    subFolder         = 'jquery-validation-unobtrusive/dist/';
    sourceFolder      = sourceConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'jquery.validate.unobtrusive.js']).pipe(gulp.dest(destinationFolder ));

    // threejs
    subFolder         = 'threejs/';
    sourceFolder      = sourceConfig.nodeModulesRoot + 'three/build/';
    destinationFolder = siteConfig.libRoot + subFolder;
    fileList = ['three.js', 'three.min.js'];
    fileList.forEach(function (file) {
        gulp.src([sourceFolder + file]).pipe(gulp.dest(destinationFolder ));
    });

    // three/examples/js
    subFolder         = 'threejs/';
    sourceFolder      = sourceConfig.nodeModulesRoot + 'three/examples/js/';
    destinationFolder = siteConfig.libRoot + subFolder;
    fileList = ['WebGL.js', 'libs/' + 'dat.gui.min.js'];
    fileList.forEach(function (file) {
        gulp.src([sourceFolder + file]).pipe(gulp.dest(destinationFolder ));
    });

    // requirejs
    subFolder         = 'requirejs/';
    sourceFolder      = sourceConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'require.js']).pipe(gulp.dest(destinationFolder ));

    // chai assertion library
    subFolder         = 'chai/';
    sourceFolder      = sourceConfig.nodeModulesRoot + subFolder;
    destinationFolder = siteConfig.libRoot + subFolder;
    gulp.src([sourceFolder + 'chai.js']).pipe(gulp.dest(destinationFolder ));
});

/// <summary>
/// Build MDBootstrap CSS
/// </summary>
gulp.task('buildMDBootstrapCSS', function (callback) {

    console.log('\nForking MDBootstrap CSS build...');
    exec(`gulp --gulpfile ${sourceConfig.mdbRoot}gulpfile.js css-compile css-minify`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

/// <summary>
/// Build MDBootstap CSS and reload the browser.
/// </summary>
gulp.task('buildMDBootstrapCSSReload', function () {

    runSequence('buildMDBootstrapCSS', 'copyVendor', 'reload', 'beep');
});

/// <summary>
/// Populate wwwroot with (licensed) vendor content
/// </summary>
gulp.task('copyVendor', function () {

    // FOLDERS

    // MDBootstrap
    let subFolder         = '';
    let sourceFolder      = '';
    let destinationFolder = '';
    let subFolderList     = [];

    // These folders are loaded by mdb.css which uses paths relative to the <CSS file>.
    subFolderList = ['font', 'img'];
    subFolderList.forEach(function (subFolder) {
        sourceFolder      = sourceConfig.mdbRootDist + subFolder;
        destinationFolder = siteConfig.wwwRoot + 'lib/mdb/';
        gulp.src([sourceFolder + '**/**']).pipe(gulp.dest(destinationFolder));
    });

    // These folders are loaded by mdb.js though jQuery.load which uses paths relative to <wwwroot>.
    subFolderList = ['mdb-addons'];
    subFolderList.forEach(function (subFolder) {
        sourceFolder      = sourceConfig.mdbRootDist + subFolder;
        destinationFolder = siteConfig.wwwRoot;
        gulp.src([sourceFolder + '**/**']).pipe(gulp.dest(destinationFolder));
    });

    // FILES
    let fileList = [];

    // MDBootstrap JavaScript
    sourceFolder      = sourceConfig.mdbRootDist + 'js/';
    destinationFolder = siteConfig.libRoot + 'mdb/js/';
    fileList = ['mdb.js', 'mdb.min.js', 'popper.min.js'];
    fileList.forEach(function (file) {
        gulp.src([sourceFolder + file]).pipe(gulp.dest(destinationFolder ));
    });

    // MDBootstrap CSS
    sourceFolder      = sourceConfig.mdbRootDist + 'css/';
    destinationFolder = siteConfig.libRoot + 'mdb/css/';
    fileList = ['mdb.css', 'mdb.min.css'];
    fileList.forEach(function (file) {
        gulp.src([sourceFolder + file]).pipe(gulp.dest(destinationFolder ));
    });
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
/// Beep task.
/// </summary>
gulp.task('beep', function () {
    beep();
});

/// <summary>
/// Default build task
/// </summary>
gulp.task('default', function () {
  runSequence('createWWWRoot', 'copyNPM', 'buildMDBootstrapCSS', 'copyVendor', 'compressJS', 'buildCSS', 'buildShaders', 'buildStaticContent');
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
//  browser: 'google chrome canary'
//  Canary
//  browser: "C:/Users/Steve Knipmeyer/AppData/Local/Google/Chrome SxS/Application/chrome.exe"

    notify: true,

    // proxy: {
    //     target: "localhost:5000/"
    // },

    // ----------------------------------------------
    // Use these settings for prototyping static pages.
    server: {
        baseDir: 'ModelRelief/wwwroot',
        directory: true
    },
    startPath: 'Workbench.html'
    // ----------------------------------------------
  });

  gulp.watch([sourceConfig.shaders + '*.glsl'],                   ['buildShadersReload']);
  gulp.watch([sourceConfig.scriptsRoot + '**/*.ts'],              ['compileTypeScriptReload']);
  gulp.watch([sourceConfig.mdbRoot + '**/*.scss'],                ['buildMDBootstrapCSSReload']);

  gulp.watch([siteConfig.cssRoot + '**/*.css'],                   ['reload']);
  gulp.watch([siteConfig.wwwRoot + '**/*.html'],                  ['reload']);
});
