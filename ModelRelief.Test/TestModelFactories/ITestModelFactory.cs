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

    public interface ITestModelFactory
    {
        Type Type { get; }
        Task<ITGetModel> FindModel(ClassFixture classFixture, int modelId);

        ITGetModel ConstructValidModel();
        Task DeleteModel(ClassFixture classFixture, ITGetModel existingModel);
        Task<ITGetModel> PostNewModel(ClassFixture classFixture);
        Task<ITGetModel> PostNewModel(ClassFixture classFixture, ITGetModel model);
    }
}