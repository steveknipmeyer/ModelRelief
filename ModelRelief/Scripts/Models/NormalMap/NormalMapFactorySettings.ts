// ------------------------------------------------------------------------//
// ModelRelief                                                             //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description NormalMapFactorySettings
 * @export
 * @class NormalMapFactorySettings
 */
export class NormalMapFactorySettings  {
    // N.B. These settings are held in a separate class to avoid circular dependencies between Camera and NormalMapFactory.
    public static DefaultResolution: number = 1024;                     // default DB resolution
}
