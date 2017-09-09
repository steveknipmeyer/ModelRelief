// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelRelief.Services
    {
    public interface IGreeter
        {
        string GetGreeting();
        }

    public class Greeter : IGreeter
        {
        public IConfiguration _configuration { get; private set; }

        public Greeter(IConfiguration configuration)
            {
            _configuration = configuration;
            }

        public string GetGreeting()
            {
            return _configuration["Greeting"];
            }
        }
    }
