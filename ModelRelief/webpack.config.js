const { NONAME } = require("dns");
const path = require("path");

var config = {
    mode: "development",
    entry: {
        main:           "./ModelRelief/Scripts/ModelRelief.ts",
        fileupload:     "./ModelRelief/Scripts/FileTransfer/FileUpload.ts",
        home:           "./ModelRelief/Scripts/Pages/Home.ts",
        layout:         "./ModelRelief/Scripts/Shared/Layout.ts",
        cameratest:     "./ModelRelief/Scripts/Workbench/CameraTest.ts",
        imagetest:      "./ModelRelief/Scripts/Workbench/ImageTest.ts",
    },
    target: ["web", "es6"],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "wwwroot/js"),
    },
    stats: {
        errorDetails: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve(__dirname),
            "node_modules",
            "node_modules/three/examples/js/libs",
        ],
        extensions: [".ts", ".js", ".min.js"],
    },

    optimization: {
        minimize: false
    },
    devtool: "inline-source-map",
};

module.exports = (env, argv) => {

    if (argv.mode === "development") {
        //
    }

    if (argv.mode === "production") {
        config.optimization = {
            minimize: true
        },
        config.devtool = "hidden-source-map";
    }

    return config;
};