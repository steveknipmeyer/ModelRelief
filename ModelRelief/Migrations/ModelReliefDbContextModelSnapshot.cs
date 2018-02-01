﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using ModelRelief.Database;
using ModelRelief.Domain;
using System;

namespace ModelRelief.Migrations
{
    [DbContext(typeof(ModelReliefDbContext))]
    partial class ModelReliefDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("ModelRelief.Domain.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("ModelRelief.Domain.Camera", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("BoundClippingPlanes");

                    b.Property<string>("Description");

                    b.Property<double>("Far");

                    b.Property<double>("FieldOfView");

                    b.Property<double>("LookAtX");

                    b.Property<double>("LookAtY");

                    b.Property<double>("LookAtZ");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<double>("Near");

                    b.Property<double>("PositionX");

                    b.Property<double>("PositionY");

                    b.Property<double>("PositionZ");

                    b.Property<int?>("ProjectId");

                    b.Property<int>("StandardView");

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("Cameras");
                });

            modelBuilder.Entity("ModelRelief.Domain.DepthBuffer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CameraId");

                    b.Property<string>("Description");

                    b.Property<bool>("FileIsSynchronized");

                    b.Property<DateTime?>("FileTimeStamp");

                    b.Property<int>("Format");

                    b.Property<double>("Height");

                    b.Property<int?>("Model3dId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Path");

                    b.Property<int?>("ProjectId");

                    b.Property<string>("UserId");

                    b.Property<double>("Width");

                    b.HasKey("Id");

                    b.HasIndex("CameraId");

                    b.HasIndex("Model3dId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("DepthBuffers");
                });

            modelBuilder.Entity("ModelRelief.Domain.Mesh", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CameraId");

                    b.Property<int?>("DepthBufferId");

                    b.Property<string>("Description");

                    b.Property<bool>("FileIsSynchronized");

                    b.Property<DateTime?>("FileTimeStamp");

                    b.Property<int>("Format");

                    b.Property<int?>("MeshTransformId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Path");

                    b.Property<int?>("ProjectId");

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("CameraId");

                    b.HasIndex("DepthBufferId");

                    b.HasIndex("MeshTransformId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("Meshes");
                });

            modelBuilder.Entity("ModelRelief.Domain.MeshTransform", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("Depth");

                    b.Property<string>("Description");

                    b.Property<double>("Height");

                    b.Property<double>("LambdaLinearScaling");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int?>("ProjectId");

                    b.Property<double>("SigmaGaussianBlur");

                    b.Property<double>("SigmaGaussianSmooth");

                    b.Property<double>("Tau");

                    b.Property<string>("UserId");

                    b.Property<double>("Width");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("MeshTransforms");
                });

            modelBuilder.Entity("ModelRelief.Domain.Model3d", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CameraId");

                    b.Property<string>("Description");

                    b.Property<DateTime?>("FileTimeStamp");

                    b.Property<int>("Format");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("Path");

                    b.Property<int?>("ProjectId");

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("CameraId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("Models");
                });

            modelBuilder.Entity("ModelRelief.Domain.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("ModelRelief.Domain.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("ModelRelief.Domain.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ModelRelief.Domain.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("ModelRelief.Domain.ApplicationUser")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ModelRelief.Domain.Camera", b =>
                {
                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);
                });

            modelBuilder.Entity("ModelRelief.Domain.DepthBuffer", b =>
                {
                    b.HasOne("ModelRelief.Domain.Camera", "Camera")
                        .WithMany()
                        .HasForeignKey("CameraId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.Model3d", "Model3d")
                        .WithMany()
                        .HasForeignKey("Model3dId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);
                });

            modelBuilder.Entity("ModelRelief.Domain.Mesh", b =>
                {
                    b.HasOne("ModelRelief.Domain.Camera", "Camera")
                        .WithMany()
                        .HasForeignKey("CameraId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.DepthBuffer", "DepthBuffer")
                        .WithMany()
                        .HasForeignKey("DepthBufferId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.MeshTransform", "MeshTransform")
                        .WithMany()
                        .HasForeignKey("MeshTransformId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);
                });

            modelBuilder.Entity("ModelRelief.Domain.MeshTransform", b =>
                {
                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);
                });

            modelBuilder.Entity("ModelRelief.Domain.Model3d", b =>
                {
                    b.HasOne("ModelRelief.Domain.Camera", "Camera")
                        .WithMany()
                        .HasForeignKey("CameraId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);
                });

            modelBuilder.Entity("ModelRelief.Domain.Project", b =>
                {
                    b.HasOne("ModelRelief.Domain.ApplicationUser", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.SetNull);
                });
#pragma warning restore 612, 618
        }
    }
}
