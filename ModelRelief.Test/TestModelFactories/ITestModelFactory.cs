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
        Task<IModel> FindModel(int modelId);
        Task<IModel> FindModelByName(string name);

        IModel ConstructValidModel();
        Task<IModel> PostNewModel();
        Task<IModel> PostNewModel(IModel model);
        Task<IModel> PutModel(IModel model);
        Task DeleteModel(IModel existingModel);
    }
}