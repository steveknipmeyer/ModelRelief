// -----------------------------------------------------------------------
// <copyright file="ITestFileModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Dto;

    public interface ITestFileModelFactory : ITestModelFactory
    {
        Task<IModel> PostNewFile(int modelId, string fileName);
        Task<IModel> PutFile(int modelId, string fileName);
    }
}