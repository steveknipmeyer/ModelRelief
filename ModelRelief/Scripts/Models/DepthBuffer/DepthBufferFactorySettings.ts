// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) <2017-2018> Steve Knipmeyer                               //
// ------------------------------------------------------------------------//
"use strict";

/**
 * @description DepthBufferFactorySettings
 * @export
 * @class DepthBufferFactorySettings
 */
export class DepthBufferFactorySettings  {
    // N.B. These settings are held in a separate class to avoid circular dependencies between Camera and DepthBufferFactory.
    public static DefaultResolution: number = 1024;                     // default DB resolution
    public static NearPlaneEpsilon: number  = .001;                     // adjustment to avoid clipping geometry on the near plane
}
