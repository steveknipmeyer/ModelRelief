﻿// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Autofac;
using Autofac.Extensions.DependencyInjection;
using MediatR;

namespace ModelRelief.Workbench 
{
    public interface IFunctionOne<T>
    {
        string F1 (T first, T second);
    }

    public interface IFunctionTwo<T>
    {
        string F2 (T first, T second);
    }

    public class F<T1, T2> : IFunctionOne<T1>, IFunctionTwo<T2>
    {
        public F()
        {
        }

        public string F1(T1 first, T1 second)
        {
            return $"F1 : {typeof(T1).ToString()}";
        }

        public string F2(T2 first, T2 second)
        {
            return $"F2 : {typeof(T1).ToString()}";
        }
    }

    public class FConcrete : IFunctionOne<int>, IFunctionTwo<double>
    {
        public FConcrete()
        {
        }

        public string F1(int first, int second)
        {
            return $"F1 : {typeof(int).ToString()}";
        }

        public string F2(double first, double second)
        {
            return $"F2 : {typeof(double).ToString()} ";
        }
    }
}
