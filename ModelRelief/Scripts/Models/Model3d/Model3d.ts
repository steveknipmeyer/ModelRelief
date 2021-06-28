// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

import {IFileModel} from "Scripts/Api/V1/Interfaces/IFileModel";
import {Model3dFormat} from "Scripts/Api/V1/Interfaces/IModel3d";
import {DtoModel3d} from "Scripts/Api/V1/Models/DtoModel3d";
import {FileModel} from "Scripts/Models/Base/FileModel";
import {BaseCamera} from "Scripts/Models/Camera/BaseCamera";
import {CameraFactory} from "Scripts/Models/Camera/CameraFactory";
import {Project} from "Scripts/Models/Project/Project";

/**
 * @description Represents a 3D model.
 * @export
 * @class Model3d
 * @extends {FileModel}
 */
export class Model3d extends FileModel {

    /**
     * @description Returns a Model3d instance through an HTTP query of the Id.
     * @static
     * @param {number} id Model3d Id.
     * @returns {Promise<Model3d>}
     */
    public static async fromIdAsync(id: number ): Promise<Model3d> {

        if (!id)
            return undefined;

        const model3d = new DtoModel3d ({
            id,
        });
        const model3dModel = await model3d.getAsync();
        return Model3d.fromDtoModelAsync(model3dModel);
    }

    /**
     * @description Constructs an instance from a DTO model.
     * @returns {Model3d}
     */
    public static async fromDtoModelAsync(dtoModel3d: DtoModel3d): Promise<Model3d> {

        // constructor
        const model3d = new Model3d ({
            id          : dtoModel3d.id,
            name        : dtoModel3d.name,
            description : dtoModel3d.description,
        });

        model3d.fileTimeStamp = dtoModel3d.fileTimeStamp;
        model3d.format        = dtoModel3d.format;

        model3d.project = await Project.fromIdAsync(dtoModel3d.projectId);
        model3d.camera  = await CameraFactory.constructFromIdAsync(dtoModel3d.cameraId);

        return model3d;
    }

    public format: Model3dFormat;

    // Navigation Properties
    public project: Project;
    public camera: BaseCamera;

    /**
     * Creates an instance of a Model3d.
     * @param {IFileModel} [parameters={}] FileModel properties.
     */
    constructor(parameters: IFileModel = {}) {

        parameters.name        = parameters.name        || "Model3d";
        parameters.description = parameters.description || "Model3d";

        super(parameters);

        this.initialize();
    }

    /**
     * @description Perform setup and initialization.
     */
    public initialize(): void {
        // NOP
    }

    /**
     * @description Returns a DTO Model3d from the instance.
     * @returns {DtoModel3d}
     */
    public toDtoModel(): DtoModel3d {

        const model3d = new DtoModel3d({
            id              : this.id,
            name            : this.name,
            description     : this.description,

            format          : this.format,

            projectId       : this.project ? this.project.id : undefined,
            cameraId        : this.camera  ? this.camera.id : undefined,

            fileTimeStamp   : this.fileTimeStamp,
        });

        return model3d;
    }
}
