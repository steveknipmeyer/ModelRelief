// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

import * as THREE       from 'three'

import {ContentType, HttpLibrary, 
        MethodType, ServerEndPoints}        from 'Http'
import { IFileModel }                       from 'IFileModel'
import { Model }                            from 'Model'
import { Services }                         from 'Services'
import { RequestResponse }                  from 'RequestResponse'

/**
 * @description Base class for a file-backed DTO model.
 * @export 
 * @class FileModel
 * @extends {Model<T>}
 * @implements {IFileModel}
 * @template T 
 */
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel{

    // not exposed in UX; API only
    fileTimeStamp: Date;

    // Private
    fileArray  : Uint8Array;
    fileString : string;

    /**
     * Creates an instance of FileModel.
     * @param {IModel} [parameters] Initialization parameters.
     */
    constructor(parameters: IFileModel = {}) {

        super (parameters);

        this.fileTimeStamp = parameters.fileTimeStamp || undefined;
    }

    /**
     * @description Posts the model and a backing file to its API endpoint.
     * @returns {Promise<T>} 
     */
    async postFileAsync(fileData : any) : Promise<T> {

        let exportTag = Services.timer.mark(`POST File: ${this.constructor.name}`);

        let newModel = await HttpLibrary.postFileAsync (this.endPoint, fileData, this);

        Services.timer.logElapsedTime(exportTag);       

        return this.factory(newModel) as T;
    }

    /**
     * @description Gets the backing file from a model.
     * @returns {Promise<UInt8Array>} 
     */
    async getFileAsync() : Promise<Uint8Array> {

        let exportTag = Services.timer.mark(`GET File: ${this.constructor.name}`);

        // cache
        if (this.fileArray)
            return this.fileArray;

        let endPoint = `${this.endPoint}/${this.id}/file`
        let result = await this.submitRequestAsync(endPoint, MethodType.Get, ContentType.OctetStream, null);       
        this.fileArray = result.byteArrayDecodedDoublePrime;
//      this._fileArray = result.byteArrayDecoded;

        Services.timer.logElapsedTime(exportTag);       

        return this.fileArray;;
    }

     /**
     * @description Gets the backing file as a string from a model.
     * // https://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
     * @returns {Promise<string>} 
     */
    async getFileAsStringAsync() : Promise<string> {

        let exportTag = Services.timer.mark(`GET File (string): ${this.constructor.name}`);

        // cache
        if (this.fileString)
            return this.fileString;

            let fileByteArray = await this.getFileAsync();
        function byteToStringConverter() : Promise<string> {
            return new Promise<string>((resolve, reject) => {
                let blobBuffer = new Blob([new Uint8Array(fileByteArray)]);

                let fileReader = new FileReader();
                fileReader.onload = function(e) {
                    resolve((<any>e.target).result);
                };
    
                fileReader.readAsText(blobBuffer);
            })
        }
        this.fileString = await byteToStringConverter();
        Services.timer.logElapsedTime(exportTag);       

        return this.fileString;
    }
}
