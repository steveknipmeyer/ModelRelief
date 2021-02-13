// -----------------------------------------------------------------------
// <copyright file="IModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Dto
{
    /// <summary>
    /// Common interface for all model types.
    /// </summary>
    public interface IModel
    {
        int Id { get; set; }

        string Name { get; set; }
        string Description { get; set; }
    }
}
