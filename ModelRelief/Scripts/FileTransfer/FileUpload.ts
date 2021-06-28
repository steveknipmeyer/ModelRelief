// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";
import {ProgressBar} from "Scripts/FileTransfer/ProgressBar";
import {IPostFormResponse} from "Scripts/FileTransfer/IPostFormResponse";
import {ElementClasses, ElementIds} from "Scripts/System/Html";
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
    private _fileButton: HTMLInputElement;
    private _dropArea: HTMLElement;

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

        this._fileButton = document.getElementById(ElementIds.FileButton) as HTMLInputElement;
        this._fileButton.addEventListener("change", () => {
            this.onChange();
        });

        this.initializeDropArea();
    }

    /**
     * @description Initialize the file drop area.
     * @private
     */
    private initializeDropArea() {

        this._dropArea = document.getElementById(ElementIds.DropArea);

        // border highlight control
        ["dragenter", "dragover"].forEach(eventName => {
            this._dropArea.addEventListener(eventName, this.highlight.bind(this), false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            this._dropArea.addEventListener(eventName, this.unhighlight.bind(this), false);
        });

        // drop
        this._dropArea.addEventListener("drop", this.handleDrop.bind(this), false);
    }

    /**
     * @description Prevent the default event behavior.
     * @private
     * @param {Event} event
     */
    private preventDefaults(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * @description Add the "highlight" class attribute.
     * @private
     * @param {DragEvent} event
     */
    private highlight(event: DragEvent) {
        this.preventDefaults(event);

        const targetElement = event.target as HTMLElement;
        targetElement.classList.add(ElementClasses.Highlight);
    }

    /**
     * @description Remove the "highlight" class attribute.
     * @private
     * @param {DragEvent} event
     */
    private unhighlight(event: DragEvent) {
        this.preventDefaults(event);
        const targetElement = event.target as HTMLElement;
        targetElement.classList.remove(ElementClasses.Highlight);
    }

    /**
     * @description Handle the drop event of a file collection.
     * @private
     * @param {DragEvent} event
     */
    private handleDrop(event:DragEvent) {

        this.preventDefaults(event);

        const dataTransfer = event.dataTransfer;
        const files = dataTransfer.files;

        this.uploadFiles(files);
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
            this._logger.addErrorMessage(`&nbsp;&nbsp;&nbsp;&nbsp;${error.message}`);
        });
    }

    /**
     * @description Upload a collection of files.
     * @private
     * @param {FileList} files Files from input button or drop event.
     */
    private uploadFiles(files: FileList) {

        Array.from(files).forEach((file) => {
            const formData = this.buildFormData(file);
            this.upload(formData, new ProgressBar(ElementIds.FormProgressBarContainer, ElementIds.ProgressBarTemplate, formData.get("Name") as string));
        });
    }

    /**
     * @description onChange button handler.
     * @return {*}  {void}
     */
    public onChange(): void {

        this.clearValidationErrors();
        this.uploadFiles(this._fileButton.files);
    }

    /**
     * @description Main
     */
    public main(): void {

        Initializer.initialize().then((status: boolean) => {

            // UI Controls
            this.initializeControls();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const fileUpload = new FileUpload();
    fileUpload.main();
});

