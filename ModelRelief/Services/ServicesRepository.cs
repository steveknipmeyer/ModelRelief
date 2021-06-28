// -----------------------------------------------------------------------
// <copyright file="ServicesRepository.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Services
{
    /// <summary>
    /// Application service manager.
    /// Provides service instances to contexts where DI is not available.
    /// Classes outside controllers (e.g. FileDomain) do not have convenient access to DependencyInjection.
    /// </summary>
    public static class ServicesRepository
    {
        public static IStorageManager StorageManager { get; set; }
    }
}
