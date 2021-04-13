
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {Graphics} from "Scripts/Graphics/Graphics";

/**
 * @description ImageTest
 * @export
 * @class ImageTest
 */
export class ImageTest {

    /**
     * Creates an instance of ImageTest.
     */
    constructor() {
        // NOP
    }

    /**
     * @description Returns a Base64 encoded string of an image URL.
     * @param {HTMLImageElement} img URL to convert
     * @return {*}  {string} Base64 encoded string
     */
    public getBase64Image(img: HTMLImageElement): string {

        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        return Graphics.getBase64Image(canvas);
    }

    /**
     * @description Encodes the test image and updates the input field
     */
    public generateEncodedImageURL(): void {

        // encode
        const imageElement: HTMLImageElement = document.getElementById("imageElement") as HTMLImageElement;
        const encodedImageURL = this.getBase64Image(imageElement);

        // update
        const encodedImageElement: HTMLInputElement = document.getElementById("base64Image") as HTMLInputElement;
        encodedImageElement.value = encodedImageURL;
    }

    /**
     * @description Main
     */
    public main(): void {
        this.generateEncodedImageURL();
    }
}

const imageTest = new ImageTest();
imageTest.main();