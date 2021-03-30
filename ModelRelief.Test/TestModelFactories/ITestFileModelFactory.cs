// -----------------------------------------------------------------------
// <copyright file="ITestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
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