// -----------------------------------------------------------------------
// <copyright file="ITestFileModelFactory.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System.Threading.Tasks;
    using ModelRelief.Dto;

    public interface ITestFileModelFactory : ITestModelFactory
    {
        string BackingFile { get; set; }

        Task<IModel> PostNewFile(int modelId, string fileName);
        Task<IModel> PutFile(int modelId, string fileName);
    }
}