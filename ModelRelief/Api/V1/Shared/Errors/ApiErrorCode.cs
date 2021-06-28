// -----------------------------------------------------------------------
// <copyright file="ApiErrorCode.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Errors
{
    /// <summary>
    /// API error codes returned by the controllers.
    /// </summary>
    public enum ApiErrorCode
    {
        // General
        Default                             = ErrorCodeBase.General + 1,
        NullRequest                         = ErrorCodeBase.General + 2,
        NotFound                            = ErrorCodeBase.General + 3,
        Unauthorized                        = ErrorCodeBase.General + 4,

        // Files
        FileCreation                        = ErrorCodeBase.Files + 1,
        FileUpdate                          = ErrorCodeBase.Files + 2,
        NoBackingFile                       = ErrorCodeBase.Files + 3,

        // Camera
        CameraGetValidationError            = ErrorCodeBase.Camera + HttpRequestBaseOffset.Get,
        CameraPostValidationError           = ErrorCodeBase.Camera + HttpRequestBaseOffset.Post,
        CameraPutValidationError            = ErrorCodeBase.Camera + HttpRequestBaseOffset.Put,
        CameraPatchValidationError          = ErrorCodeBase.Camera + HttpRequestBaseOffset.Patch,
        CameraDeleteValidationError         = ErrorCodeBase.Camera + HttpRequestBaseOffset.Delete,

        // DepthBuffer
        DepthBufferGetValidationError       = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Get,
        DepthBufferPostValidationError      = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Post,
        DepthBufferPutValidationError       = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Put,
        DepthBufferPatchValidationError     = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Patch,
        DepthBufferDeleteValidationError    = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Delete,

        // Mesh
        MeshGetValidationError              = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Get,
        MeshPostValidationError             = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Post,
        MeshPutValidationError              = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Put,
        MeshPatchValidationError            = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Patch,
        MeshDeleteValidationError           = ErrorCodeBase.Mesh + HttpRequestBaseOffset.Delete,

        // MeshTransform
        MeshTransformGetValidationError     = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Get,
        MeshTransformPostValidationError    = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Post,
        MeshTransformPutValidationError     = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Put,
        MeshTransformPatchValidationError   = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Patch,
        MeshTransformDeleteValidationError  = ErrorCodeBase.DepthBuffer + HttpRequestBaseOffset.Delete,

        // Model3d
        ModelGetValidationError             = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Get,
        ModelPostValidationError            = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Post,
        ModelPutValidationError             = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Put,
        ModelPatchValidationError           = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Patch,
        ModelDeleteValidationError          = ErrorCodeBase.Model3d + HttpRequestBaseOffset.Delete,

        // NormalMap
        NormalMapGetValidationError             = ErrorCodeBase.NormalMap + HttpRequestBaseOffset.Get,
        NormalMapPostValidationError            = ErrorCodeBase.NormalMap + HttpRequestBaseOffset.Post,
        NormalMapPutValidationError             = ErrorCodeBase.NormalMap + HttpRequestBaseOffset.Put,
        NormalMapPatchValidationError           = ErrorCodeBase.NormalMap + HttpRequestBaseOffset.Patch,
        NormalMapDeleteValidationError          = ErrorCodeBase.NormalMap + HttpRequestBaseOffset.Delete,

        // Project
        ProjectgetValidationError = ErrorCodeBase.Project + HttpRequestBaseOffset.Get,
        ProjectPostValidationError          = ErrorCodeBase.Project + HttpRequestBaseOffset.Post,
        ProjectPutValidationError           = ErrorCodeBase.Project + HttpRequestBaseOffset.Put,
        ProjectPatchValidationError         = ErrorCodeBase.Project + HttpRequestBaseOffset.Patch,
        ProjectDeleteValidationError        = ErrorCodeBase.Project + HttpRequestBaseOffset.Delete,
    }

    /// <summary>
    /// Error code offsets for resource groups.
    /// Messages for each resource type begin at the offset.
    /// </summary>
    public enum ErrorCodeBase
    {
        Unknown         = 0,

        General         = 100,
        Files           = 500,
        Camera          = 1000,
        DepthBuffer     = 2000,
        Mesh            = 3000,
        MeshTransform   = 4000,
        Model3d         = 5000,
        NormalMap       = 6000,
        Project         = 7000,
    }

    /// <summary>
    /// Error code offsets for HTTP method types.
    /// Messages for each method begin at the offset.
    /// </summary>
    public enum HttpRequestBaseOffset
    {
        Unknown         = 0,

        Get             = 1,
        Post            = 2,
        Put             = 3,
        Patch           = 4,
        Delete          = 5,
    }
}