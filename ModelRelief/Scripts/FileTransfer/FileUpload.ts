// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ProgressBar} from "Scripts/FileTransfer/ProgressBar";
import {ElementIds} from "Scripts/System/Html";
import {Initializer} from "Scripts/System/Initializer";
import {ILogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

/**
 * @description File upload support.
 * @export
 * @class FileUpload
 */
export class FileUpload {

    private _logger: ILogger;
    private _uploadForm: HTMLFormElement;
    private _progressBar: ProgressBar;

    /**
     * Creates an instance of FileUpload.
     */
    constructor() {
        this._logger = Services.htmlLogger;
    }

    /**
     * @description Initialize the file upload controls.
     */
    public initializeControls(): void {

        this._uploadForm = document.getElementById(ElementIds.UploadForm) as HTMLFormElement;
        this._uploadForm.addEventListener("submit", () => {
            this.upload();
        });

        this._progressBar = new ProgressBar(ElementIds.ProgressBar);
    }

    /**
     * @description Upload a file and update the ProgressBar.
     * @return {*}  {void}
     */
    public upload(): void {
        // https://stackoverflow.com/questions/15410265/file-upload-progress-bar-with-jquery

        const antiForgeryToken: HTMLInputElement = document.querySelector("#uploadForm input[name='__RequestVerificationToken']") as HTMLInputElement;

        const name: HTMLInputElement  = document.getElementById("name") as HTMLInputElement;
        const description: HTMLInputElement = document.getElementById("description") as HTMLInputElement;
        const fileButton: HTMLInputElement = document.getElementById("fileButton") as HTMLInputElement;
        const files = fileButton.files;
        if (files.length === 0)
            return;

        const formData = new FormData();
        formData.append("Name", name.value);
        formData.append("Description", description.value);
        formData.append("FormFile", files[0]);
        formData.append("__RequestVerificationToken", antiForgeryToken.value);

        this._progressBar.enable(true);
        $.ajax({
            xhr: () => {
                const xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {

                        let percentComplete: number = event.loaded / event.total;
                        percentComplete = percentComplete * 100;
                        this._progressBar.update(percentComplete);
                    }
                }, false);

                return xhr;
            },
            url: "/models/create",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                this._progressBar.enable(false);
                const redirect = response.redirectToUrl;
                if (redirect === undefined) {
                    console.log(response);
                }
                else
                    window.location.href = redirect;
            },
            error: (error) => {
                this._progressBar.enable(false);
                console.error(error);
            }
        });
    }

    /**
     * @description Main
     */
    public run(): void {

        Initializer.initialize().then((status: boolean) => {

            // UI Controls
            this.initializeControls();
        });
    }
}
const fileUpload = new FileUpload();
fileUpload.run();
