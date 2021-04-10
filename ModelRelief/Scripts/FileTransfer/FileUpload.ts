// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";
import {ProgressBar} from "Scripts/FileTransfer/ProgressBar";
import {IPostFormErrorResponse} from "Scripts/FileTransfer/IPostFormErrorResponse";
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
        this._uploadForm.addEventListener("submit", () => {
            this.onSubmit();
        });

    }

    /**
     * @description Clears all the validation messages on the form.
     */
    private clearValidationErrors(): void {

        this._logger.clearLog();
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
    private buildFormDataFromForm(): FormData {

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

            success: (response) => {
                progressBar.enable(false);

                const redirect = response.redirectToUrl;
                if (redirect === undefined) {
                    this.logUploadErrors(response as IPostFormErrorResponse);
                }
                else
                    window.location.href = redirect;
            },
            error: (error) => {
                progressBar.enable(false);
                this._logger.addErrorMessage(error.toString());
            },
        });

    }

    /**
     * @description Log error messages returned in the upload response.
     * JSON response object contains an IPostFormErrorResponse which packages validation errors from ModelState.
     */
    private logUploadErrors(response: IPostFormErrorResponse): void {

        this._logger.addErrorMessage(response.fileName);
        response.errors.forEach((error) => {
            this._logger.addErrorMessage(`    ${error.field}: ${error.message}`);

            const inputField = document.querySelector(`[data-valmsg-for="${error.field}"]`);
            inputField.innerHTML = error.message;
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

        const formData = this.buildFormDataFromForm();
        this.upload(formData, new ProgressBar(ElementIds.FormProgressBarContainer, ElementIds.ProgressBarTemplate));
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

