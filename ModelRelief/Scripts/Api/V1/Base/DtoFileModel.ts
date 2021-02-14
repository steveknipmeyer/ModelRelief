// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {DtoModel} from "Scripts/Api/V1/Base/DtoModel";
import {IFileModel} from "Scripts/Api/V1/Interfaces/IFileModel";
import {ContentType, HttpLibrary, MethodType, ServerEndPoints} from "Scripts/System/Http";
import {Services} from "Scripts/System/Services";

/**
 * @description Base class for a file-backed DTO model.
 * @export
 * @class FileModel
 * @extends {DtoModel<T>}
 * @implements {IFileModel}
 * @template T
 */
export class DtoFileModel<T extends IFileModel> extends DtoModel<T> implements IFileModel {

    // not exposed in UX; API only
    public fileTimeStamp: Date;

    // Private
    private fileArray: Uint8Array;
    private fileString: string;

    /**
     * Creates an instance of FileModel.
     * @param {IModel} [parameters] Initialization parameters.
     */
    constructor(parameters: IFileModel = {}) {

        super(parameters);

        this.fileTimeStamp = parameters.fileTimeStamp || undefined;
    }

    /**
     * @description Returns the HTTP endpoint for a file request.
     * @readonly
     * @type {string}
     */
    get fileEndPoint(): string {
        return `${this.endPoint}/${this.id}/file`;
    }

    /**
     * @description Posts the model and a backing file to its API endpoint.
     * @returns {Promise<T>}
     */
    public async postFileAsync(fileData: ArrayBuffer): Promise<T> {

        const exportTag = Services.timer.mark(`POST File: ${this.constructor.name}`);

        const newModel = await HttpLibrary.postFileAsync(this.fileEndPoint, fileData);

        Services.timer.logElapsedTime(exportTag);

        return this.factory(newModel) as T;
    }

    /**
     * @description Gets the backing file from a model.
     * @returns {Promise<UInt8Array>}
     */
    public async getFileAsync(): Promise<Uint8Array> {

        const exportTag = Services.timer.mark(`GET File: ${this.constructor.name}`);

        // cache
        if (this.fileArray)
            return this.fileArray;

        const result = await this.submitRequestAsync(this.fileEndPoint, MethodType.Get, ContentType.OctetStream, null);
        this.fileArray = result.byteArrayDecodedDoublePrime;
        //      this._fileArray = result.byteArrayDecoded;

        Services.timer.logElapsedTime(exportTag);

        return this.fileArray;
    }

    /**
     * @description Gets the backing file as a string from a model.
     * // https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
     * @returns {Promise<string>}
     */
    public async getFileAsStringAsync(): Promise<string> {

        const exportTag = Services.timer.mark(`GET File (string): ${this.constructor.name}`);

        // cache
        if (this.fileString)
            return this.fileString;

        const fileByteArray = await this.getFileAsync();
        function byteToStringConverter(): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                const blobBuffer = new Blob([new Uint8Array(fileByteArray)]);

                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    resolve((e.target as any).result);
                };

                fileReader.readAsText(blobBuffer);
            });
        }
        this.fileString = await byteToStringConverter();
        Services.timer.logElapsedTime(exportTag);

        return this.fileString;
    }
}
