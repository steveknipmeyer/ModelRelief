// -----------------------------------------------------------------------
// <copyright file="ITestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ModelRelief.Api.V1.Shared.Rest;
    using ModelRelief.Dto;

    public interface ITestModelFactory
    {
        Type Type { get; }
        Task<IModel> FindModel(ClassFixture classFixture, int modelId);

        IModel ConstructValidModel();

        Task<IModel> PostNewModel(ClassFixture classFixture);
        Task<IModel> PostNewModel(ClassFixture classFixture, IModel model);
        Task<IModel> PutModel(ClassFixture classFixture, IModel model);
        Task DeleteModel(ClassFixture classFixture, IModel existingModel);
    }
}