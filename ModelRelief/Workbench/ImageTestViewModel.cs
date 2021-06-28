// -----------------------------------------------------------------------
// <copyright file="ImageTestViewModel.cs" company="ModelRelief">
// MIT License (https://github.com/steveknipmeyer/ModelRelief/blob/main/MIT-LICENSE.txt)
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Workbench
{
    using System.ComponentModel.DataAnnotations;

    public class ImageTestViewModel
        {
        [Required]
        public string Base64Image { get; set; }
        }
    }
