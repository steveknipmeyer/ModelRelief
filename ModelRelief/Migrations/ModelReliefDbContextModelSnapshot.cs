﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using ModelRelief.Database;

namespace ModelRelief.Migrations
{
    [DbContext(typeof(ModelReliefDbContext))]
    partial class ModelReliefDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.0-rtm-35687")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("ModelRelief.Domain.Camera", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("AspectRatio");

                    b.Property<double>("Bottom");

                    b.Property<string>("Description");

                    b.Property<double>("EulerX");

                    b.Property<double>("EulerY");

                    b.Property<double>("EulerZ");

                    b.Property<double>("Far");

                    b.Property<double>("FieldOfView");

                    b.Property<bool>("IsPerspective");

                    b.Property<double>("Left");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<double>("Near");

                    b.Property<double>("PositionX");

                    b.Property<double>("PositionY");

                    b.Property<double>("PositionZ");

                    b.Property<int?>("ProjectId");

                    b.Property<double>("Right");

                    b.Property<double>("ScaleX");

                    b.Property<double>("ScaleY");

                    b.Property<double>("ScaleZ");

                    b.Property<double>("Theta");

                    b.Property<double>("Top");

                    b.Property<double>("UpX");

                    b.Property<double>("UpY");

                    b.Property<double>("UpZ");

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("Cameras");
                });

            modelBuilder.Entity("ModelRelief.Domain.DepthBuffer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

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

                    b.ToTable("DepthBuffers");
                });

            modelBuilder.Entity("ModelRelief.Domain.Mesh", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("CameraId");

                    b.Property<int?>("DepthBufferId");

                    b.Property<string>("Description");

                    b.Property<bool>("FileIsSynchronized");

                    b.Property<DateTime?>("FileTimeStamp");

                    b.Property<int>("Format");

                    b.Property<int?>("MeshTransformId");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<int?>("NormalMapId");

                    b.Property<string>("Path");

                    b.Property<int?>("ProjectId");

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("CameraId");

                    b.HasIndex("DepthBufferId");

                    b.HasIndex("MeshTransformId");

                    b.HasIndex("NormalMapId");

                    b.HasIndex("ProjectId");

                    b.ToTable("Meshes");
                });

            modelBuilder.Entity("ModelRelief.Domain.MeshTransform", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<double>("AttenuationDecay");

                    b.Property<double>("AttenuationFactor");

                    b.Property<double>("Depth");

                    b.Property<string>("Description");

                    b.Property<double>("GradientThreshold");

                    b.Property<double>("Height");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<double>("P1");

                    b.Property<double>("P2");

                    b.Property<double>("P3");

                    b.Property<double>("P4");

                    b.Property<double>("P5");

                    b.Property<double>("P6");

                    b.Property<double>("P7");

                    b.Property<double>("P8");

                    b.Property<int?>("ProjectId");

                    b.Property<double>("UnsharpGaussianHigh");

                    b.Property<double>("UnsharpGaussianLow");

                    b.Property<double>("UnsharpHighFrequencyScale");

                    b.Property<string>("UserId");

                    b.Property<double>("Width");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("MeshTransforms");
                });

            modelBuilder.Entity("ModelRelief.Domain.Model3d", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

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

                    b.ToTable("Models");
                });

            modelBuilder.Entity("ModelRelief.Domain.NormalMap", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

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

                    b.Property<int>("Space");

                    b.Property<string>("UserId");

                    b.Property<double>("Width");

                    b.HasKey("Id");

                    b.HasIndex("CameraId");

                    b.HasIndex("Model3dId");

                    b.HasIndex("ProjectId");

                    b.ToTable("NormalMaps");
                });

            modelBuilder.Entity("ModelRelief.Domain.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("UserId");

                    b.HasKey("Id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("ModelRelief.Domain.Camera", b =>
                {
                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
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

                    b.HasOne("ModelRelief.Domain.NormalMap", "NormalMap")
                        .WithMany()
                        .HasForeignKey("NormalMapId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.SetNull);
                });

            modelBuilder.Entity("ModelRelief.Domain.MeshTransform", b =>
                {
                    b.HasOne("ModelRelief.Domain.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId")
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
                });

            modelBuilder.Entity("ModelRelief.Domain.NormalMap", b =>
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
                });
#pragma warning restore 612, 618
        }
    }
}
