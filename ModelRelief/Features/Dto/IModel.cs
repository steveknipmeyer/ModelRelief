// -----------------------------------------------------------------------
// <copyright file="IModel.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
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
