// -----------------------------------------------------------------------
// <copyright file="IInitializer.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Database
{
    using System.Threading.Tasks;

    public interface IInitializer
    {
        void Initialize();
    }
}