// -----------------------------------------------------------------------
// <copyright file="AutofacExperiments.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Workbench
{
    public interface IFunctionOne<T>
    {
        string F1(T first, T second);
    }

    public interface IFunctionTwo<T>
    {
        string F2(T first, T second);
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
            return $"F2 : {typeof(T2).ToString()}";
        }
    }

    public class FConcrete : IFunctionOne<int>, IFunctionTwo<double>
    {
        public FConcrete()
        {
        }

        public string F1(int first, int second)
        {
            return $"FConcrete.F1 : {typeof(int).ToString()}";
        }

        public string F2(double first, double second)
        {
            return $"FConcrete.F2 : {typeof(double).ToString()} ";
        }
    }

    public class FConcretePrime : IFunctionOne<int>, IFunctionTwo<double>
    {
        public FConcretePrime()
        {
        }

        public string F1(int first, int second)
        {
            return $"FConcretePrime.F1 : {typeof(int).ToString()}";
        }

        public string F2(double first, double second)
        {
            return $"FConcretePrime.F2 : {typeof(double).ToString()} ";
        }
    }

    public class FConcreteDoublePrime : IFunctionOne<int>, IFunctionTwo<double>
    {
        public FConcreteDoublePrime()
        {
        }

        public string F1(int first, int second)
        {
            return $"FConcreteDoublePrime.F1 : {typeof(int).ToString()}";
        }

        public string F2(double first, double second)
        {
            return $"FConcreteDoublePrime.F2 : {typeof(double).ToString()} ";
        }
    }
}
