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
        this._logger = Services.defaultLogger;
    }

    /**
     * @description Initialize the file upload form.
     */
    private initializeControls(): void {

        this._uploadForm = document.getElementById(ElementIds.UploadForm) as HTMLFormElement;
        this._uploadForm.addEventListener("submit", () => {
            this.onSubmit();
        });

        this._progressBar = new ProgressBar(ElementIds.ProgressBar);
    }

    /**
     * @description Clears all the validation messages on the form.
     */
    private clearValidationErrors(): void {
        const summaryErrors = document.querySelectorAll(".validation-summary-errors");
        summaryErrors.forEach((summaryError) => {
            summaryError.innerHTML = "";
        });
        const summaryFields = document.querySelectorAll(".field-validation-error");
        summaryFields.forEach((summaryField) => {
            summaryField.innerHTML = "";
        });
    }

    /**
     * @description Construct the FormData payload for the upload.
     * @return {*}  {FormData}
     */
    private buildFormData(): FormData {

        const formData = new FormData();
        for (let index = 0; index < this._uploadForm.length; index++) {
            const element = this._uploadForm.elements[index];
            if (element instanceof HTMLInputElement) {

                const modelField = element.name;
                switch (element.type) {

                    case "file":
                        formData.append(modelField, element.files[0]);
                        break;

                    case "text":
                        formData.append(modelField, element.value);
                        break;

                    default:
                    case null:
                    case "submit":
                        break;
                }
            }
        }
        const antiForgeryToken: HTMLInputElement = document.querySelector(`#${ElementIds.UploadForm} input[name="__RequestVerificationToken"]`) as HTMLInputElement;
        formData.append("__RequestVerificationToken", antiForgeryToken.value);

        return formData;
    }

    /**
     * @description (AJAX) uploade the FormData to the create endpoint.
     * @private
     * @param {FormData} formData
     */
    private upload(formData: FormData): void {
        // https://stackoverflow.com/questions/15410265/file-upload-progress-bar-with-jquery

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
            url: window.location.href,
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                this._progressBar.enable(false);

                const redirect = response.redirectToUrl;
                if (redirect === undefined) {
                    // JSON object contains validation errors from ModelState
                    const fields = Object.keys(response);
                    fields.forEach((field, index) => {
                        const inputField = document.querySelector(`[data-valmsg-for="${field}"]`);
                        inputField.innerHTML = response[field];
                    });
                }
                else
                    window.location.href = redirect;
            },
            error: (error) => {
                this._progressBar.enable(false);
                this._logger.addErrorMessage(error.toString());
            },
        });
    }

    /**
     * @description Submit button handler.
     * @return {*}  {void}
     */
    public onSubmit(): void {

        // ensure valid form
        const $form = $(`#${ElementIds.UploadForm}`);
        const $validator = $form.validate();
        if (!$form.valid())
            return;
        this.clearValidationErrors();

        const formData = this.buildFormData();
        this.upload(formData);
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

