// -----------------------------------------------------------------------
// <copyright file="PostPreviewRequest.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Api.V1.Shared.Rest
{
    using System.Security.Claims;
    using MediatR;
    using ModelRelief.Domain;
    using ModelRelief.Dto;

    /// <summary>
    ///  Represents a POST request of a preview image.
    /// </summary>
    /// <typeparam name="TEntity">The domain type of the model.</typeparam>
    /// <typeparam name="TGetModel">The DTO GET model.</typeparam>
    /// <remarks>This request is used to create a preview that is a associated with a model.</remarks>
    public class PostPreviewRequest<TEntity, TGetModel> : BaseRequest, IRequest<TGetModel>
        where TEntity    : DomainModel
        where TGetModel  : IModel
    {
        /// <summary>
        /// Gets or sets the associated resource Id of the preview.
        /// </summary>
        public int? Id { get; set; }

        /// <summary>
        ///  Gets or sets the incoming preview.
        /// </summary>
        public PostPreview NewPreview { get; set; }
    }
}
