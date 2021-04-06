﻿// -----------------------------------------------------------------------
// <copyright file="ITestModelFactory.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Test.TestModels
{
    using System;
    using System.Threading.Tasks;
    using ModelRelief.Dto;

    public interface ITestModelFactory
    {
        ClassFixture ClassFixture { get; }
        Type TEntityType { get; }
        Type TGetModelType { get; }
        string ApiUrl { get; set; }
        Task<IModel> FindModel(int modelId);
        Task<IModel> FindModelByName(string name);

        IModel ConstructValidModel();
        Task<IModel> PostNewModel();

        Task<IModel> PutModel(IModel model);
        Task DeleteModel(IModel existingModel);
    }
}