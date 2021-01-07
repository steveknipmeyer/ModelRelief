// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description WebGL Detection
 * Based on three library WebGL.js.
 * @export
 * @class WebGL
 */
export class WebGLDetector {

    /**
     * @description Tests whether the browser supports WebGL.
     * @return {*}  {boolean}
     */
    public isWebGLAvailable(): boolean {

        try {

            const testCanvas = document.createElement("canvas");
            return !!(window.WebGLRenderingContext && (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl")));

        } catch (e) {

            return false;
        }
    }

    /**
     * @description Tests whether the browser supports WebGL2.
     * @return {*}  {boolean}
     */
    public isWebGL2Available(): boolean {

        try {

            const canvas = document.createElement("canvas");
            return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"));

        } catch (e) {

            return false;
        }
    }

    /**
     * @description Returns the WebGL browser error message.\\
     * @return {*}  {HTMLElement}
     */
    public getWebGLErrorMessage(): HTMLElement {

        return this.getErrorMessage(1);
    }

    /**
     * @description Returns the WebGL browser error message.\\
     * @return {*}  {HTMLElement}
     */
    public getWebGL2ErrorMessage(): HTMLElement {

        return this.getErrorMessage(2);
    }

    /**
     * @description Returns the (version-specific) WebGL error message
     * @param {number} version Verion of WebGL
     * @return {*}  {HTLMElement} Error message
     */
    public getErrorMessage (version: number): HTMLElement {

        const names = {
            1: "WebGL",
            2: "WebGL 2"
        };

        const contexts = {
            1: window.WebGLRenderingContext,
            2: window.WebGL2RenderingContext
        };

        let message = "Your $0 does not seem to support <a href=\"http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation\" style=\"color:#000\">$1</a>";

        const element = document.createElement("div");
        element.id = "webglmessage";
        element.style.fontFamily = "monospace";
        element.style.fontSize = "13px";
        element.style.fontWeight = "normal";
        element.style.textAlign = "center";
        element.style.background = "#fff";
        element.style.color = "#000";
        element.style.padding = "1.5em";
        element.style.width = "400px";
        element.style.margin = "5em auto 0";

        if (contexts[version]) {
            message = message.replace("$0", "graphics card");
        } else {
            message = message.replace("$0", "browser");
        }

        message = message.replace("$1", names[version]);

        element.innerHTML = message;

        return element;
    }
}
