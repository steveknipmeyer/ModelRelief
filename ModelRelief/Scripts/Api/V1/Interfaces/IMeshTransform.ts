
// ------------------------------------------------------------------------//
// ModelRelief                                                             //
//                                                                         //
// Copyright (c) Steve Knipmeyer. All rights reserved.                     //
// ------------------------------------------------------------------------//
"use strict";

import {IModel} from "Scripts/Api/V1/Interfaces/IModel";
import {IProject} from "Scripts/Api/V1/Interfaces/IProject";

/**
 *  Represents a DTO for a MeshTransform.
 *  N.B. All properties in the interface are optional so that an initialization object can be used to construct the concrete class.
 *  @description Settings that transform a DepthBuffer to a Mesh.
 *  @interface
 */
export interface IMeshTransform extends IModel {

  width?: number;
  height?: number;
  depth?: number;

  // Gradient Threshold
  gradientThresholdEnabled?: boolean
  gradientThreshold?: number;

  // Gradient Attenuation
  attenuationEnabled?: boolean;
  attenuationFactor?:   number;             // attenuation (~a)
  attenuationDecay?: number;                // attenuation decay (b)

  // Unsharp Masking
  unsharpMaskingEnabled?: boolean;
  unsharpGaussianLow?: number;              // Gaussian low
  unsharpGaussianHigh?: number;             // Gaussian high
  unsharpHighFrequencyScale?: number;       // high frequency scaling

  // Geometry
  planarBackground?: boolean;               // force background to zero
  translateMeshZPositive?: boolean;         // force all mesh points to Z+

  // Silhouette Processing
  silhouetteEnabled?: boolean;
  silhouetteEdgeWidth?: number;             // edge width of contours
  silhouetteSigma?: boolean;                // Gaussian blur

  // Final Scale
  reliefScale?: number;                     // relief scale (% of original model)

  // P1 (placeholder)
  p1Enabled?: boolean;
  p1?: number;
  // P2 (placeholder)
  p2Enabled?: boolean;
  p2?: number;
  // P3 (placeholder)
  p3Enabled?: boolean;
  p3?: number;
  // P4 (placeholder)
  p4Enabled?: boolean;
  p4?: number;
  // P5 (placeholder)
  p5Enabled?: boolean;
  p5?: number;
  // P6 (placeholder)
  p6Enabled?: boolean;
  p6?: number;
  // P7 (placeholder)
  p7Enabled?: boolean;
  p7?: number;
  // P8 (placeholder)
  p8Enabled?: boolean;
  p8?: number;

  // Navigation Properties
  projectId?: number;
  project?: IProject;
}
