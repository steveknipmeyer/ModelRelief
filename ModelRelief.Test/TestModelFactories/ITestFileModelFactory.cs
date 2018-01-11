// -----------------------------------------------------------------------
// <copyright file="ITestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Rest;

    public interface ITestFileModelFactory : ITestModelFactory
    {
        Task<ITGetModel> PostNewFile(ClassFixture classFixture, int modelId, string fileName);
        Task<ITGetModel> PutFile(ClassFixture classFixture, int modelId, string fileName);
    }
}