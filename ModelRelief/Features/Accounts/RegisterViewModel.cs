// -----------------------------------------------------------------------
// <copyright file="RegisterViewModel.cs" company="ModelRelief">
// Copyright (c) ModelRelief. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

namespace ModelRelief.Features.Accounts
{
    using System.ComponentModel.DataAnnotations;

    public class RegisterViewModel
        {
        [Required]
        [MaxLength(256)]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; }
        }
    }
