// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ProgressBar} from "Scripts/FileTransfer/ProgressBar";
import {IPostFormResponse} from "Scripts/FileTransfer/IPostFormResponse";
import {ElementIds} from "Scripts/System/Html";
import {Initializer} from "Scripts/System/Initializer";
import {ILogger, HTMLLogger} from "Scripts/System/Logger";
import {Services} from "Scripts/System/Services";

/**
 * @description File upload support.
 * @export
 * @class FileUpload
 */
export class FileUpload {

    private _logger: ILogger;
    private _uploadForm: HTMLFormElement;
    private _fileButton: HTMLInputElement;

    /**
     * Creates an instance of FileUpload.
     */
    constructor() {
        this._logger = Services.htmlLogger;
    }

    /**
     * @description Initialize the file upload form.
     */
    private initializeControls(): void {

        this._uploadForm = document.getElementById(ElementIds.UploadForm) as HTMLFormElement;

        this._fileButton = document.getElementById(ElementIds.FileButton) as HTMLInputElement;
        this._fileButton.addEventListener("change", () => {
            this.onChange();
        });
    }

    /**
     * @description Clears all the validation messages on the form.
     */
    private clearValidationErrors(): void {

        // this._logger.clearLog();

        const validationFields = document.getElementsByClassName("text-danger");
        Array.from(validationFields).forEach((field) => {
            field.innerHTML = "";
        });
    }

    /**
     * @description Construct the FormData payload for the upload.
     * @return {*}  {FormData}
     */
    private buildFormData(file: File): FormData {
        const fileName = file.name.replace(/^.*[\\/]/, "");

        const formData = new FormData();
        formData.append("Name", fileName);
        formData.append("Description", fileName);
        formData.append("FormFile", file);

        const antiForgeryToken: HTMLInputElement = document.querySelector(`#${ElementIds.UploadForm} input[name="__RequestVerificationToken"]`) as HTMLInputElement;
        formData.append("__RequestVerificationToken", antiForgeryToken.value);

        return formData;
    }

    /**
     * @description (AJAX) uploade the FormData to the create endpoint.
     * @private
     * @param {FormData} formData The FormData to upload.
     * @param {ProgressBar} progressBar ProgressBar to update with progress of upload.
     */
    private upload(formData: FormData, progressBar: ProgressBar): void {
        // https://stackoverflow.com/questions/15410265/file-upload-progress-bar-with-jquery

        progressBar.enable(true);
        $.ajax({
            xhr: () => {
                const xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {

                        let percentComplete: number = event.loaded / event.total;
                        percentComplete = percentComplete * 100;
                        progressBar.update(percentComplete);
                    }
                }, false);

                return xhr;
            },
            url: window.location.href,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,

            success: (ajaxResponse) => {
                progressBar.remove();

                const response = ajaxResponse as IPostFormResponse;
                if (!response. success)
                    this.logUploadErrors(response);
                else {
                    this.logUploadSuccess(response);
                }
            },
            error: (ajaxError) => {
                progressBar.remove();
                this._logger.addErrorMessage(ajaxError.toString());
            },
        });
    }

    /**
     * @description Log a successful file upload.
     */
    private logUploadSuccess(response: IPostFormResponse): void {

        this._logger.addInfoMessage(`${response.fileName}: successfully uploaded.`);
    }

    /**
     * @description Log error messages returned in the upload response.
     */
    private logUploadErrors(response: IPostFormResponse): void {

        this._logger.addErrorMessage(`${response.fileName}: errors during upload. `);
        response.errors.forEach((error) => {
            this._logger.addErrorMessage(`    ${error.field}: ${error.message}`);

            const inputField = document.querySelector(`[data-valmsg-for="${error.field}"]`);
            inputField.innerHTML = error.message;
        });
    }

    /**
     * @description onChange button handler.
     * @return {*}  {void}
     */
    public onChange(): void {

        this.clearValidationErrors();

        Array.from(this._fileButton.files).forEach((file) => {
            const formData = this.buildFormData(file);
            this.upload(formData, new ProgressBar(ElementIds.FormProgressBarContainer, ElementIds.ProgressBarTemplate, formData.get("Name") as string));
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

