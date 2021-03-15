// -----------------------------------------------------------------------
// <copyright file="Session.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    using System.ComponentModel.DataAnnotations;
    using AutoMapper;

    /// <summary>
    /// Represents a DataTransferObject (DTO) for Session.
    /// </summary>
    public class Session : IModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Navigation Properties
        public int? ProjectId { get; set; }
        public Project Project { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="Session"/> class.
        /// Constructor.
        /// </summary>
        public Session()
        {
        }
    }

    /// <summary>
    /// AutoMapper mapping profile.
    /// </summary>
    public class SessionMappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SessionMappingProfile"/> class.
        /// Constructor.
        /// </summary>
        public SessionMappingProfile()
        {
            CreateMap<Domain.Session, Session>().ReverseMap();
        }
    }
}
