// -----------------------------------------------------------------------
// <copyright file="ImageTestViewModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
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
