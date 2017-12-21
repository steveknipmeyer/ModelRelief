// ------------------------------------------------------------------------// 
// ModelRelief                                                             //
//                                                                         //                                                                          
// Copyright (c) <2017> Steve Knipmeyer                                    //
// ------------------------------------------------------------------------//
using System;
using System.Collections.Generic;
using System.Text;

namespace ModelRelief.Test
{
    /// <summary>
    /// Unit test settings that describe the host and runtime environment.
    /// These should be mocked.
    /// </summary>
    class Settings
    {
        public static readonly string Scheme = "http";
        public static readonly string Host   = "localhost";
        public static readonly int Port      = 60655;

        public static string ContentRootFolder = "ModelRelief";
        public static string DatabaseFolder = "Database";
        public static string TestFilesFolder = "Test/Data/Files";

        public static readonly string ApiDocumentatioRelative  ="/api/v1/documentation";
    }
}
