[33mcommit ef809616d065cc0335527f0dc6ede368fe8cab36[m[33m ([m[1;36mHEAD -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 18 16:03:40 2018 -0400

    Refactor Explorer to move solution logic to Solver.

[33mcommit 2fa2236da5e1892a5ad5135f97aed0be4dd02bfd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 18 14:42:29 2018 -0400

    Partial refactoring to move complete solution calculation from Explorer to Solver.

[33mcommit ee9fa62175b1b18f98bbb4572d3b256809051cad[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 18 07:07:29 2018 -0400

    Update database schema DGML.

[33mcommit a31866523990ba0123023fa1e618534d166c6c45[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 18 04:44:57 2018 -0400

    Mesh file integration test replace UnsharpMaskHFScale with P1.

[33mcommit 771e853358b72d02461a33cc081868334eb0a0fd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 17 14:34:25 2018 -0400

    Package UnsharpMasking parameters into a structure similar to AttenuationParameters.

[33mcommit 2a6a0d8ec22274fc4c11c67c1802a5b51455b488[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 17 13:53:53 2018 -0400

    Rebuild test JSON settings files with new MeshTransform properties.

[33mcommit b3724646718f556e6f10547274f5190b69b8b9a4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 17 13:29:44 2018 -0400

    Solver now uses (wwwroot) relative file paths to locate files.

[33mcommit a97348cf076911feb58b816a6b6ea0cf54dc773f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 17 07:19:34 2018 -0400

    Update ProjectNotes.

[33mcommit 55b544fc33cc98755c159afebe8882f8f3c34b58[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 17 05:23:10 2018 -0400

    Complete FE refactoring for new MeshTransform properties.

[33mcommit c70fa3310c211abf7d3ce7ebf7c1872ad3165430[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 16 17:14:59 2018 -0400

    Complete BE refactoring for new MeshTransform properties.

[33mcommit 4c6d3536786bc6c7228b6de57333b71b53ee9ab4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 16 16:36:56 2018 -0400

    Change default MeshTransform settings.
    Add new MeshTransform placeholder settings: P1, P2/
    Refactor MeshTransform setting property names.

[33mcommit 5dccb6e62ca7c946d15d06f74d07aa06dedfa71c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 16 09:25:49 2018 -0400

     Remove unused Solver diagnostic messages.

[33mcommit 536cb8cadebeaa3bfcfca817ba37298f0c158c8a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 15 14:38:57 2018 -0400

    Enable Explorer MeshTransform settings.

[33mcommit 0ff285a577f39d5db97d3a62edafaeae112cb54f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 15 14:24:59 2018 -0400

    Attenuation is a percentage of mean absolute value.
    Set Explorer mesh to solid color instead of using colormap.
    Refine Explorer MeshTransform UI layout.
    Default Attenuation Decay = 0.6.

[33mcommit d09af91849e11199e386170533e7246ac300289b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 15 11:20:53 2018 -0400

    Explorer: Start maximized.

[33mcommit b289a6f609acbaeafe829148bac23451f950c981[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 15 07:40:59 2018 -0400

    Exclude the background result in the gradient mask. It causes the leading forward derivatives along +X, +Y to be excluded.

[33mcommit 55604568f22eacb5b7e4fcdf585798ed1b1f1f89[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 14 08:27:39 2018 -0400

    FiniteDifference uses transpose for Y to consolidate X,Y.

[33mcommit bb03fc65d44673459b2e3037187a196c076df0e7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 12 06:43:07 2018 -0400

    Update ProjectNotes.

[33mcommit 5541e25800e918cef3abacc52399746a3ed58f87[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 11 07:15:29 2018 -0400

    Poisson solution now returns original mesh with no pre-processing.

[33mcommit 1d309c93c21ee62c162a4f670bf02ed506b4d38a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 10 17:16:05 2018 -0400

    Add Diffence class to support array finite difference operations.

[33mcommit 1bb63c3d387bde8e830a018c843246c342721bb5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 10 09:53:56 2018 -0400

    Add new Explorer tabs for Relief image and Model mesh.

[33mcommit 79964955a3917c6d5b17c58ad86670e85a704c47[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 9 15:42:36 2018 -0400

    Add TestDepthBuffer which defines a simple model for debugging the solver.

[33mcommit 47536cb200523de962060a0f01cd0982a7f7c01e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 9 07:53:53 2018 -0400

    Implement nominal support for the AMG solution of the Poisson equation.

[33mcommit bc79bb44b740eaf44787c28fa8060926e40d393c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 8 14:04:44 2018 -0400

    Add AMG demo examples.

[33mcommit f7376df395b3195004bbcea36370e08cbb5240bc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 3 07:29:32 2018 -0400

    Resolver several mypy warnings in Explorer.

[33mcommit dbd1763caec2caba3aa5089cf5aac9d37e178af4[m
Merge: faa7d6f 1135762
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 3 05:00:32 2018 -0400

    Merge branch 'master' of https://github.com/steveknipmeyer/ModelRelief

[33mcommit 11357622d3c026278b74396027e3027a45a8347d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 3 05:00:07 2018 -0400

    Refine Explorer.resize_ui logic.

[33mcommit faa7d6fd7d378570358d968a2416cd1bb6bb6641[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 3 04:34:19 2018 -0400

    Add VSCode workspace file.

[33mcommit 903409213d97a51eec452e0c29c94ffbc16021af[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 2 07:24:54 2018 -0400

    Explorer: Add ImageTab.size_figure to resize images based on parent widget.

[33mcommit bfb82b08b3a183f830ee4f7d5e820f332de14445[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 1 18:51:06 2018 -0400

    Explorer: Size ImageTab based on parent dimensions.

[33mcommit 6fe334ba5842d3eb6b69c56d7e8ba10ff89803e6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 1 16:10:02 2018 -0400

    Explorer inherits from QtWidgets.QMainWindow, obsoleting ExplorerWindow.

[33mcommit e624e19d3b8d8495fef1ce46f96cf2dfb6eab330[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 1 10:37:01 2018 -0400

    Implement a timer in Explorer.resizeEvent to resize the ImageTabs only when the resize is complete.

[33mcommit bdb498a87e31a46ea5b5504cb0cf6a060cccbd43[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 1 10:22:40 2018 -0400

    Explorer: Frame support for resizing the main application window.

[33mcommit 9f5cf63264f51edb2fbc6342224085e9b344f157[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jun 30 16:36:21 2018 -0400

    Preserve camera across Explorer updates.

[33mcommit d59af2b15f29f204ec027fa094f0d7fc304bce20[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jun 29 14:51:03 2018 -0400

    Correct tab focus order of MeshTransform panel.

[33mcommit 9c9b90b6dcdcc179443730a181536670a24ad41f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jun 26 16:58:15 2018 -0400

    Add VSCode workspace.

[33mcommit 9d802a4b21b3536c4209b29a3a52712fcb00a41e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jun 16 13:19:53 2018 -0400

    Add Jupyter Gradients notebook.

[33mcommit c8cd80ebd10c3e65ca905131a4ae858390a21792[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jun 16 11:29:40 2018 -0400

    Add Relief tab to Explorer.

[33mcommit 8357598208de181909a1fa1827496d0ab31d7994[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jun 16 09:41:50 2018 -0400

    Add AMG example.

[33mcommit 667a9c6700dbc06c4e2099ad28b0d038d4cf2748[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jun 15 13:07:44 2018 -0400

    Add unsharp masking stage to Explorer.

[33mcommit 031ad29baba0f2c0edc776106decbf477b6a67f8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jun 15 10:30:57 2018 -0400

    Add gradient icon to Explorer.

[33mcommit cc25fe5962d7d65e0ac4770d021c27e133439762[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jun 3 07:38:38 2018 -0400

    Add attenuation support to Explorer.

[33mcommit c977430f645a42a40ea04070a86c26420c813551[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon May 28 18:53:39 2018 -0400

    Maintain separate scene instances in GradientX|YMesh.

[33mcommit f14675823b73c957ba242f08c076884c63708525[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon May 28 16:32:39 2018 -0400

    Explorer: Add unique test meshes for debugging.

[33mcommit 97212b22e2214637ce35c0c53f179da6700c7a43[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon May 28 14:42:54 2018 -0400

    Initial support in Explorer for mayavi mesh views.

[33mcommit 686a6671da2d63165eb9c3a816a82c452bd43eba[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon May 28 08:08:29 2018 -0400

    Experiments with mayavi2.

[33mcommit 2c4ed729334596a9c997517a27552022da1abb77[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 27 18:05:33 2018 -0400

    Add title to 3D mesh views.

[33mcommit 1cddf162691be868bc4fbccaa10609b10dd0a769[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 27 17:46:31 2018 -0400

    Add GradientX (Isometric) and GradientY(Top) meshes to Explorer.

[33mcommit 08b1bdcca2ef6e5f5728ea4ee6afd568085ae71b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 27 16:46:57 2018 -0400

    Generalize ImageTab to ViewTab in Explorer.
    Add support for proxy 3d mesh in Mesh tabs.

[33mcommit 428ff7b96e058e463e76aab678e42624d6f11802[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 27 13:33:25 2018 -0400

    Explorer: Add keyboard accelerators and checkboxes to control MeshTransform.

[33mcommit b3480f15a9f8584388c42f469d87ce19dea18b4f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 27 07:40:14 2018 -0400

    Explorer: Refinements to tab order.

[33mcommit 101cf77446679dfc88985132192e40bfa577099b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 27 06:53:43 2018 -0400

    Add Python Function Parameters notebook.

[33mcommit 3d3642b8b5f505d0f5452166d99c64639ae147f2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 27 06:09:33 2018 -0400

     Explorer: Refactor figure generation to share common add_image.

[33mcommit e6a95b97356ed53c25189f05d83ed6fe47990264[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 26 17:29:01 2018 -0400

    Explorer: Add File->Open.

[33mcommit 0a50c2ab7d6a81b9802392d3a8c344ab86ae557e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 26 16:59:38 2018 -0400

    Explorer: Implement separate image tabs.

[33mcommit 2200d3d4c90b7dccfc03a1cca23fb09a0914a33a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 26 12:09:18 2018 -0400

    Explorer: Move to tabbed interface with separate image views.

[33mcommit 191c5faba5138826139564b39c029a8a4ab2c673[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 25 16:33:58 2018 -0400

    Move Solver to Explorer.

[33mcommit b2516381b2644fadf733d29dc72abe1217894a21[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 25 10:35:49 2018 -0400

    Add Tau setting to Explorer.

[33mcommit d06cb88133693210cdd15dd2d37a235b25831101[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 25 09:55:34 2018 -0400

    Explorer: Add dark Qt styling.

[33mcommit e7e99ec970608fe93b3c38c8c2588538af798bae[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 25 07:15:22 2018 -0400

    Explorer.set_figure allows FigureCanvas to be dynamically set.

[33mcommit afd1eef41e69da83a815da24e240b0dbde7d19f7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 25 05:56:24 2018 -0400

    Refactor Viewer -> Explorer.

[33mcommit 1f9f9d72b68891607c1f608858c7304f4d8f4fea[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 24 17:15:59 2018 -0400

    Resolve Post_InvalidReferencePropertyReturnsBadRequest.

[33mcommit 9e81d7f5b54c7a33b27bbf2ad3e4a3863e28f3a3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 24 15:49:10 2018 -0400

    DepthBuffer: Add gradient_x|y, background_mask properties.

[33mcommit ed4b071f2d182c28ee75dd86fbb02d6ec35b9f12[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 24 11:03:30 2018 -0400

    Experiments: Add PyQt example.

[33mcommit 11827bfe50a67bec2e52af08733df023bdf4d507[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 24 05:31:03 2018 -0400

    Extend Mask class and refactor Solver.

[33mcommit 72fbb27e1422a2e16b0f2fe21dcd47fb227f34ae[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed May 23 15:05:18 2018 -0400

    Solver: Add initial support for masks.

[33mcommit cf470cec5b055d95fab491205820b246d27377d8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue May 22 07:57:48 2018 -0400

    Resolve MyPy static issues.

[33mcommit b5193f4763c58f2cf25809722e222aae80684a0d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue May 22 05:05:06 2018 -0400

    Add log files to TestRunner.

[33mcommit 7cd9f1db3ffc377ead2b074028088660e4e10f4b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon May 21 07:26:59 2018 -0400

    DbInitializer now created the baseline Test database.

[33mcommit 6f4c58a63a288bf53d430ee7b9bddc0ac10dfc08[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 20 16:02:47 2018 -0400

    Add TestRunner to execute unit tests for SQLServer and SQLite.

[33mcommit 06d37507755e3b0e2c1ef5154786b2c8ccc3f17c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 20 09:12:06 2018 -0400

    Refactor startup configuration handling.

[33mcommit 5fba1648c573ebe2d8ec0edeeaa7ab1446593d13[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 20 06:31:13 2018 -0400

    Add forceInitialize parameter to DbIntializer.

[33mcommit 2995296215585c3bcc0f66ae913875908bcebef3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 19 14:41:39 2018 -0400

    Upgrade all .NET packages.
    Refactor ClassFixture to share ServerFramework with CollectionFixture.
    Remove unnecessary AutoMapper unit test (included in Startup).

[33mcommit 5c0c816140151f3d4829eb85703324e35f6044d5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 19 12:13:43 2018 -0400

    Refine keyboard accelerators for Viewer.

[33mcommit 1ca90ed75809b5e25d26e928e839f211b5b788df[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 19 09:45:50 2018 -0400

    Add keyboard accelerators to Viewer for standard views.
    Increase range of Tau in UI.
    Modify the default threshold; Tau = 5.
    Disable the keyboard handlers in TrackBall.
    On mousedown set the focus to the canvas in TrackBall.

[33mcommit 6cb0b6199c4f876ab604ebfdc0804e2108fbaf01[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 18 14:38:06 2018 -0400

    Change default Mesh format in Solver to SFP.

[33mcommit b0d8ae0f58f53110e6d0c744eb2ae1bcb1ac9c2d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 18 10:05:34 2018 -0400

    Update Solver test JSON files to reflect new file extensions.

[33mcommit dac7f83641624b529876c3796dea575772719fc8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 18 09:50:04 2018 -0400

    Introduce SDB, SFP file formats.

[33mcommit 08589e040f4693979c0dc4e8d98b5f2a83e99f96[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 18 07:51:41 2018 -0400

    Refactor Loader to use SinglePrecisionLoader.

[33mcommit c4a182a74f519fd4aa141943798d60c250f6349d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 18 04:57:23 2018 -0400

    Introduce Mesh3d class to contruct THREE Meshes.

[33mcommit 5a52a229d1e3a3f22e685ca328dc8f201dd35f46[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 17 14:44:14 2018 -0400

    Add Logger.

[33mcommit 3170d1316dd8fbaee009f4a6959a53f8f33209ee[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 17 11:13:30 2018 -0400

    Extend PYTHONPATH to include Tools folder for Colors access.

[33mcommit c76971b9ba06ec91b991593f5b58ae7c9f03de28[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 17 10:08:52 2018 -0400

    Update project notes with large model issue.

[33mcommit d43fd15af0db4e13a98b63fd193320047d99a8d0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 17 08:58:26 2018 -0400

    DepthBuffer: Replace cached extrema with calculated properties.
    DepthBuffer.rgbArray is invalidated when setting depths property.
    Fit initial Mesh view in ComposerView after loadModelAsync rather than through EventType.NewModel.

[33mcommit 2152bcfcedb42d7c12e3738b4ad79796c1893129[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu May 17 07:38:03 2018 -0400

        Added Loaders for depth buffer and float files.
        Added SinglePrecisionDepthBufferLoader
        Added SinglePrecisionFloatLoader
        Refactor TestModelLoader to be async.
        DepthBuffer: Remove overlapping camera (near, far, clipping range) properties.
        Resolve issue with MeshCache. Key must be based on model extents not aspect ratio.

[33mcommit 791dcf4a4cdddd78f1eb93d9bfe20d398e2904d0[m
Author: Steve Knipmeyer <stephen@Vector.localdomain>
Date:   Wed May 16 11:50:40 2018 -0400

    Add Services class wth StopWatch for solver.

[33mcommit 79df1cee1e7bc595d54334e42ccb96e88e5a9948[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue May 15 06:58:27 2018 -0400

    Move meshscale.scale_buffer to depthbuffer
    Introduce a file conversion class FileManager.
    Add logging suppression for categogy 'Microsoft'.

[33mcommit 247a88c4ecde8b7c0807efe7c5c1bd44f3474f2f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon May 14 06:00:20 2018 -0400

    Add Solver modules to support each processing step.

[33mcommit 522ba142afcdbea03a5b7b24f6f0337a84e930a9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 13 19:17:00 2018 -0400

    Improve subplot margins in Viewer.

[33mcommit f85a4d373f2648004139cd4f15c2257b0f0e8a6e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 13 18:58:59 2018 -0400

    Group workbench images in ScrollableWindow.

[33mcommit 8f3553363738cd708425845b0b1e53a4405df79a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 13 17:54:50 2018 -0400

    Refactor workbench to become a driver for the Solver module.
    All relief processing should be done in Solver.
    Workbench is a lightweight means to explore Solver solutions.

[33mcommit c59bd1ff2dc06377648a28ff98686825426c2d8e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 13 11:22:56 2018 -0400

    File creation in Solver active only in debug mode.

[33mcommit f4c880f0244437f87952a64269e8021a893ba7c4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun May 13 10:58:27 2018 -0400

    Add DepthBuffer.floats_raw to return normalized values.
    Refactor Solver to improve style consistency.

[33mcommit 81d552b64b671142f1387d616d425e080c51512d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 12 14:00:59 2018 -0400

    Optimization experiments.

[33mcommit 216cc9fad3994bfec42b2b5eef642061b68c8d37[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 12 13:28:44 2018 -0400

    Benchmark Python versus Numpy gradients.

[33mcommit 179e4a9af63418b3962131890222413e38a7488e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 12 12:49:28 2018 -0400

    Remove Pylint warnings for workbench and modules

[33mcommit b73c13d0d64d647c75275543fbf03509d5e92b41[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 12 11:32:55 2018 -0400

    Further experiments with workbench gradients.

[33mcommit 846685bfa013fa4fefe7475e223610b905176a01[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat May 12 05:48:35 2018 -0400

    =Experiments with array gradients.

[33mcommit 6d3adf1972865192a0fda92840c959a39a55a079[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 11 16:32:48 2018 -0400

    Split Viewer class into a separate module.

[33mcommit a9b39593a6c264ea442c90a986bf934d7aabfe5f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 11 14:11:59 2018 -0400

    Update the ID ranges in the integration test model factories.

[33mcommit d26ccc09a9802218fa878c779fafa933b2f23053[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 11 14:03:44 2018 -0400

    Add VSCcode GitHub markdown extension.

[33mcommit dc8c5c3067ab0c6435532e8b3d9a5caf48e2e474[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri May 11 10:02:38 2018 -0400

    Add test model test.obj as a reference model.

[33mcommit ce795c522ea9890f25c1a69cd40204e1e52f333e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Apr 24 07:17:21 2018 -0400

    Refactor Solver to use numpy (40X).

[33mcommit 86d3697200766e7c0ec50300529866ee8d96c368[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Apr 24 04:30:43 2018 -0400

    Remove unused fileName parameter from Dispatcher.
    Remove unused working paramter from viewer.py.

[33mcommit 712a0dcdb67966d1a72752e1e485196ce4c9f645[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Apr 23 05:47:27 2018 -0400

    Remove unused fileName parameter from Dispatcher methods.
    Remove unused working paramter from viewer.py.

[33mcommit de1b1da0bacf767750a8c68fa0dde02273845c2f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Mar 17 08:48:54 2018 -0400

    Update Jupyter notebooks.

[33mcommit 2a4becca6e6f8ce47c8a3b89f46c8bee545ff3ee[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 9 16:38:14 2018 -0500

    DepthBufferFactory receives the Canvas element as a parameter.

[33mcommit 1140a30f5ca652a0d0d75621dcd14d09ee844151[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 9 14:31:24 2018 -0500

    Add DepthBufferViewer.

[33mcommit 36200199c7cd9ffee7e87de717a68feec8794a56[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 9 10:49:09 2018 -0500

    Frame DepthBufferView.

[33mcommit 1600dd43712a2800d418e2fce1e1d4f18bea6da2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 9 10:10:02 2018 -0500

    Add CSS styles to ConsoleLogger.
    Add DepthBuffer by default to Composer View.

[33mcommit 8b6952b34c6d899a6b7b12ce61596f8e3b6c3667[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 9 05:55:39 2018 -0500

    Add Jupyter Viewer notebook.

[33mcommit aaf8a7adae19402849b361f1ebab8ab991499050[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Mar 7 05:12:54 2018 -0500

    Refactor FileRequest_MeshGenerateScalesDepthBufferByLambdaLinearScaling.

[33mcommit 0dbce87e07a4f97d81a9f4e603641a0a37dd424d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Mar 4 15:41:38 2018 -0500

    Solver transforms DB by LamdaLinearScaling.
    Test DepthBuffers now have private MeshTransforms.
    Add Camera to Mesh dependency graph in Mesh file integration tests.

[33mcommit a5e67280eef7725014f3c7db1ff18edb2852d5e5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Mar 3 10:01:30 2018 -0500

    Dispatcher includes DepthBuffer.Camera in Mesh.

[33mcommit 9f2e93f0a9c56b7f6e008cc83be6d340a67a48e6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 2 15:53:46 2018 -0500

    CameraHelper.boundClippingPlanes sets near and far independently.
    The calculated meshExtents in DepthBuffer.constructGraphicsByTriangulation
    are too small and lead to resolution issues if the near plane is at the default. So,now
    the near and far plane are always set to the model extents when they have the default values.

[33mcommit 1adf755203f99a8b382d4af42a71e9c511c0e754[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 2 14:12:07 2018 -0500

    Correct Lucy camera quaternion.

[33mcommit 11bf175e974735158d0f183d5833f9fbc737121f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 2 08:50:05 2018 -0500

    More refactoring of ComposerController.
    Changing the ModelViewer camera clipping planes calls updateProjectionMatrix.
    The cameraZ was incorrect for Lucy camera.

[33mcommit 5678608cbf68570e6cf875039733b5f2cc3c10b6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Mar 2 05:20:26 2018 -0500

    ComposerController properties for active objects.

[33mcommit 29f46bbcf1a2a5cf9a35d350057eda7f360b6b4a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 28 11:07:47 2018 -0500

    Set ModelView camera to DepthBuffer camera.

[33mcommit 08390063381704e2871276ef011cf058c26d7aab[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 28 10:27:54 2018 -0500

    Refactor ComposerController to edit initial mesh.

[33mcommit 576067809eafd866cd497e31faa81fe3ba072c72[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Feb 27 05:19:10 2018 -0500

    Remove endpoint property from FE classes.

[33mcommit ce175b38c382c84c6f31c750c84006617d177d54[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Feb 27 05:13:43 2018 -0500

    Refine FE interfaces and base classes.
    - IModel, IFileModel, IGeneratedFileModel : remove optional methods
    - FE classes are no longer generic.
    - FE and DTO classes have separate base classes.
    - Data transfer is done only in DTO classes.

[33mcommit cb803e700bf49086b0669f4bf38a53b7cf96a6b2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Feb 26 05:10:09 2018 -0500

    FE classes do not share base classes with DTOs.
    DTOs are used exclusively for HTTP operations.
    Rename ToDo to ProjectNotes.

[33mcommit e0c3b07b06ea1f23e08b54af64bbaa2fead8275a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 14:13:24 2018 -0500

    Viewer default camera = Top.

[33mcommit 629a780a17e8d7f422ca5c6b5b96b77ca3971e5c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 14:05:55 2018 -0500

    Adjust Cameras in test dataaset to match DepthBuffers.

[33mcommit d71d90a047e21245986fc873d2790895758c2df9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 10:50:12 2018 -0500

    Initialize fileTimeStamp and fileIsSyncrhonized.

[33mcommit 7906082c328c345dc4318495ce16618e4f3b5eb7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 10:27:48 2018 -0500

    Test Mesh models are now RAW format.
    ComposerView triggers the Mesh loading in MeshViewer.

[33mcommit b582e34ee5b0843a5d8c9893f668cffc94df9afc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 09:06:03 2018 -0500

    Add IFileModel.getModelGroupAsync.
    Add implementations in DepthBuffer, Mesh and Model3d.

[33mcommit d3db3b9f0b8d18cb67ae9d25872d3aeceefb92e9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 08:27:58 2018 -0500

    Use FE application mdoels in ComposerView.
    Use Model, Mesh in ModelViewer, MeshViewer.

[33mcommit 3c42efcf1c0fd3b5fba348f8f5dca4821c06f7c6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 06:40:13 2018 -0500

    Initialize endPoint in FE application models.
    Add logger to Model base class.
    Add initialization method for all FE application models.

[33mcommit 3e4b952dde7644efadc599b312552b5099c1f738[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 25 04:15:48 2018 -0500

    Move constructGraphics to DepthBuffer.

[33mcommit a43d0db27ee29efe59b50c6a536ee189ee721025[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 24 08:53:52 2018 -0500

    Model3d, Project : Remove id navigation properties.
    Model3d, Project : Fully populate application models.

[33mcommit 9f4c0409ed6bb4d7289381932a510ef7442e3f43[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 24 08:23:44 2018 -0500

    Upgrade git to resolve HttpException errors.

[33mcommit b253f3de63bb7fc956484dfe684b8ca703349b76[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 24 08:17:18 2018 -0500

    Mesh, MeshTransform : Remove id navigation properties.
    Mesh, MeshTransform : Fully populate application models.

[33mcommit ef3b4aa2e7fb46620483ce21ba0bb7a0b3469283[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 24 06:12:18 2018 -0500

    Camera, DepthBuffer : Remove id navigation properties.
    Camera, DepthBuffer : Fully populate application models.

[33mcommit e719d1d5354779651b59a95d74560cca7c48b72b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 24 04:40:06 2018 -0500

    Camera FE application constructor overrides Model.
    Add static fromId helper method to all FE application models.
    Cache FileModel results in fileArray/fileString.

[33mcommit 29c7413bb1422bed47acc0217983b01bd671357c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Feb 23 15:00:37 2018 -0500

    Generalize Model, FileModel, GeneratedFileModel.
    DepthBuffer FE application constructor overrides base class constructors.
    Add static fromId helper method to Camera FE application model.

[33mcommit 5ebb7124683cfc2266fdc207d7bf69cbaf0e3641[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 22 15:41:00 2018 -0500

    Use DTO Model, FileModel, GeneratedFileModel.
    Remove FE Model, FileModel, GeneratedFileModel as they overlapped unnecessarily.

[33mcommit c679c5ee01a22571e40d10b964e8df08b85a0f56[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 21 10:57:22 2018 -0500

    Introduce Composer controller and view.
    The Composer controller uses a Mesh as the view model.
    The Composer Edit view serializes the Mesh view model into an HTML script tag.
    ComposerView initializes the active Mesh (and related models) from the view model and constructs full DTO classes.

[33mcommit 22d5c0e57160de0c0fafd5e9cbe6a9942098512e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 21 04:08:31 2018 -0500

    Add CameraControlsOptions to hide controls.

[33mcommit c77bbdcaf7c524c3e3b51403703261085e622b3b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Feb 19 12:02:39 2018 -0500

    Add IFileModel property to Viewers.

[33mcommit 22ad0a1fc489420a49c3f9b54ba68a71fd0a174d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 18 15:10:54 2018 -0500

    Rename Viewer.model to modelGroup (THREE.Group).

[33mcommit cb83b3102db9a850a0d6779591612babd2adc0e5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 18 14:21:21 2018 -0500

    Add addLoader method to Viewer class.

[33mcommit a37c920e22a8b9f453dc9f10691eb8dbb7c14a78[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 18 14:05:00 2018 -0500

    Refactor Loader class to return a Mesh.

[33mcommit 9454b52c48e91dcdafc352b0b20a167cdea0068d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 18 09:20:20 2018 -0500

    Loader.loadOBJModel -> Loader.loadOBJModelAsync

[33mcommit 2dc0f96a57e06a1db7289c317b0a561c04106921[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 18 06:48:48 2018 -0500

    Add documentation to FE classes.

[33mcommit 072952271503454442773a877bbe16e838987f30[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 17 11:28:55 2018 -0500

    Subclass FE classes from base classes.
    Change Camera.DefaultFarCippingPlane to 1000.

[33mcommit cf374969dd2d6755ebcbcfe3ce57b140adb29a5a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 17 06:52:49 2018 -0500

    Camera: Add Quaternion, Scale, Aspect, Up.
    Camera: Remove LookAt, StandardView and BoundClipping properties.
    Resolve several issue with Workbench pages.
        @section block is required to correctly load scripts.
    Graphics.removeAllByName uses object.parent.remove not scene.remove to prevent infinite loop.
    _Layout loads workbench.css for all environments.

[33mcommit ca3e4f3592bf9f8a12f5f50feb64995070fc9b68[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 15 09:01:41 2018 -0500

    Remove CameraSettings.
    Use FE Camera in CameraControlSettings.

[33mcommit be5508728efe6259c67038cf7c80cdbd4e28c41b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 15 05:23:59 2018 -0500

    Move StandardView to ICamera.
    Add StandardView property to FE Camera.

[33mcommit 66d1124c04f43c5b0ac5b0ed07f020a68da01998[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 14 15:21:26 2018 -0500

    buildShaders task creates output folder.

[33mcommit fb55dbb8d9b4ccbebcade1f7f6c2d9d21f7f247b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 14 09:45:09 2018 -0500

    bf: Use object destructuring for constructors
        Correctly handles "falsey" (0, false, Nan, undefined, null) initialization parameters.
        (setting = parameter || undefined) incorrectly assignes 'undefined' instead of a falsey value.

[33mcommit 38bf52fe9d0f8a5fe9e47161e3a87cf9cd38cb28[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 14 08:37:30 2018 -0500

    Correct FE interface hierarchy.
    Update ToDo.

[33mcommit eb04d74631bb0932f2da7f2d76863dace8580852[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Feb 9 11:20:52 2018 -0500

    Add GitBash batch file to Tools.

[33mcommit e09bcfb05485d31f25c683deed392fa9e288f683[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 15:36:41 2018 -0500

    Update ToDo.

[33mcommit b9b91c3a3511df928be64f90f50299b303105e6f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 15:11:09 2018 -0500

    Add TODO XPlatform note about Python arguments.

[33mcommit 6503577cac10a42e1a51f7fee94f9c1e7744a54c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 14:51:44 2018 -0500

    Resolve EOL issues with shaders.js.

[33mcommit a6741a91d1fe2b1dbbe7f177a7b39c460f814372[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 12:40:45 2018 -0500

    Use backward slashes for SQLServer in appsettings.

[33mcommit 233ec2f84108c7a80c79d69a1a1ffa4c8e0f2d91[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 12:03:03 2018 -0500

    Exclude SQLite databases from Database folder.

[33mcommit 15de5b0145b241f7354fde30b22f1f61acb102b3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 11:56:26 2018 -0500

    Modify appsettings.json to use forward slashes.

[33mcommit 025e2eda61775cee17362c23f8a6e9bdaa1d099b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 10:15:59 2018 -0500

    Really remove wwwroot/js.

[33mcommit 3794399cf88564bcd86157b4b4b6b3d69430d92f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 10:07:40 2018 -0500

    Remove wwwroot js folder.

[33mcommit a5c8921b1280bd0ada13bf4d8a6d2c466ad2720b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 10:00:02 2018 -0500

    Remove wwwroot js and lib folders.
    These folders are created by the build.

[33mcommit 7b07d5d99a58ecfb964e757f9d00375d0b0dc9b3[m
Merge: 04c26d0 fb2b708
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 06:30:36 2018 -0500

    Merge

[33mcommit 04c26d08ce927ebfb031b02b6c62b5ec69001264[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 06:27:29 2018 -0500

    Update npm packages (orphans).

[33mcommit b4b1ae32986eeb473bf1b8f8ba820533d30c03fb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 06:23:28 2018 -0500

    Update npm packages.

[33mcommit fb2b708596b24259945fe7114ce49a2d7d70a85a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Feb 7 05:24:35 2018 -0500

    Add gul-eol for end of line processing for shaders.js.

[33mcommit 786a1394e8a55e25ec5e8ab8afc08e1b339c578c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 4 22:20:42 2018 -0500

    Add Ubuntu debugging notes.

[33mcommit c5ec11413832aa1b4ab154ed3ba521f6a86c8be5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 4 18:15:46 2018 -0500

    Add Ubuntu notes to ToDo.

[33mcommit 5574c82033d96d5f99caffaf11d8010748d3c09e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Feb 4 11:10:08 2018 -0500

    Additional implementation for Camera.toDtoModel and Camera.fromDtoModel.

[33mcommit dd1b97d383270d0312d37194fd741e01a0c42ee5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Feb 3 12:15:50 2018 -0500

    ComposerControler.postCameraAsync creates the Dto.Camera based on the (clipped) ModelViewer camera.
    DepthBufferFactoryParameters.camera is not optional.
    Split Camera into Camera, CameraHelper.
    Move the setCameraClippingPlanes method to the application Camera class.

[33mcommit b2b8fab193c9e176a8e52ed03affb204433ba62b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Feb 2 16:05:27 2018 -0500

    Add FE base classes for Model, FileModel and GeneratedFileModel.

[33mcommit d5c727ee69ba19dffd4377ffe8fc0fcf080d98c4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Feb 2 09:44:06 2018 -0500

    Add new tasks for 'gulp server', 'dotnet PID', 'dotnet run' to set up live reloading for FE work.

[33mcommit b938e04b432040b3fd8cd70f76bbe9a6abb13430[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Feb 2 05:19:27 2018 -0500

    Disaable  global.json.

[33mcommit 3e0534ac36b6dd81c429e5cc9c8c17981378647a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 1 19:04:24 2018 -0500

    Resolve several issues on Lambda after environment changes.

[33mcommit cf4db5883a06bc7ff209a67ccc838ce6b0bc5290[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 1 18:04:35 2018 -0500

    Move SQLServer and SQLite strings to a settings file.
    Add diagnostic log of environment settings at startup.
    Refactor all environment variables to use 'MR' prefix.

[33mcommit 0250972838a88c33f5547c52a1fffb8c13560f7d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 1 11:55:05 2018 -0500

    Extend FE DepthBuffer models and interfaces to support Width, Height properties.

[33mcommit 641c2445ef35192948796d5cd1ddebc32bb148a5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 1 11:11:14 2018 -0500

    configure the Services.IConfigurationProvider in ServerFramerwork for use with automated tests.
    Add DepthBuffer Width and Height properties to BE.

[33mcommit 44c074923557d88abc5a936747989fe193049c53[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Feb 1 03:51:18 2018 -0500

    Extend MeshTransform to include Height property.

[33mcommit 82b73d482fefd0e06ff51d9f86070c7feb651d5a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 31 11:28:27 2018 -0500

    Add getAsync method to FE Model.
    Move VSCode User settings to Workspace.
    Remove FE Relief class. It duplicated Mesh, MeshTransform and DepthBuffer properties.

[33mcommit dae16d157275f98f914cbd27e3e8724dbe92bbc1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 31 11:08:52 2018 -0500

    Move FE models to Models folder.
    Add getAsync method to FE Model.
    Move VSCode User settings to Workspace.

[33mcommit 44a12081530a407474b5cf9321061db4072a6dc9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jan 29 05:56:26 2018 -0500

    Add ConvertBase64 and FileModel.getFileAsync.

[33mcommit 39f764b04bf4bdd44a7d382d8e247f6526635cea[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jan 28 11:03:49 2018 -0500

    Rationalize FE interfaces and classes for consistency with the BE.

[33mcommit 1216bddc01de2f00d8d56e0153fb5a987b47fd0e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jan 28 09:57:05 2018 -0500

    Rationalize BE interfaces and class names for Domain nd DTOmodels for better consistency with FE.

[33mcommit 190f8fa439c536fef2aef58d749119b231c451d1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jan 28 07:26:50 2018 -0500

    Displatcher.GenerateMeshAsync did not persist updated mesh.

[33mcommit d27c7d0ce869fbb2ea77f6e52acf41139a831476[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jan 28 07:19:31 2018 -0500

    Extend GeneratedFileDomainModel with SynchronizeGeneratedFile.

[33mcommit 019772e2c6dbb723a00b0290b5db895f2caaae14[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 27 13:38:27 2018 -0500

    Return strongly-typed objects from BaseModel putFileAsync and postAsync.

[33mcommit 9cc5fbcf6be571b242a1e9c1eca4c628c7ecfc05[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 27 10:56:41 2018 -0500

    Add generic classes (BaseModel, FileBaseMode, GeneratedFileBaseModel) for FE DTO models.

[33mcommit e552ce0bd8d93d9d6ff606ec58e0882a90e6f1d6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 27 06:05:31 2018 -0500

    Add FE DTO constructors that initialize an instance based on an interface parameter.
    Move FE models to Models folder.
    Always provide mock authentication to support 'dotnet run' which cannot be configured to use 'Test'.

[33mcommit a8e11f0da82974395b69bc9c402f90d0cdaf9e20[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 26 15:44:22 2018 -0500

    Add Exception class.
    PostFileAsync now returns ITGetModel.
    Change Logger interface to ILogger.

[33mcommit f92a3ecc4593c66dcc7278a04c6813febfea553f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 26 14:43:21 2018 -0500

    Refactor Mesh.generateRelief to Mesh.generateReliefAsync.

[33mcommit e1672e8c8518bb27122b8fa1d770308228aa977a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 26 11:15:40 2018 -0500

    Add NodeWorkbench project for Node experimentation.

[33mcommit e71c46f04f10f0949de3f05c41a332c0d55df1d9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 26 07:56:05 2018 -0500

    Changes to package-lock.json.

[33mcommit ad01a283d92ffcf950d7d9cfbcf1b6b829f30b96[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 26 07:37:39 2018 -0500

    GetSolverPath returns a relative path.

[33mcommit 399fcc9ae9f17daa45e0cec3235a2f531977b787[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 26 07:33:45 2018 -0500

    Experiments with creating a Camera model during Save Relief.
    Document environment variables (InitializeUserStore, InitializeDatabase) handling in Todo.
    Add helper methods for resolving the Python interpreter and solver paths.

[33mcommit ae09e36f748b7b3b77ac4bf326889552ce6414c2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 25 13:36:02 2018 -0500

    Add MeshTransform class.

[33mcommit a2f9c8d463926dc0dac43a96b3792893e069df1d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 25 11:41:50 2018 -0500

    Visual Code: Change launch.json to specify NET 2.0 and use an external terminal (support for Console.ReadLine).
    Visual Studio: Provide explicit settings for InitializeUserStore, InitialDatabase in launchSettings.json.

[33mcommit f60910881be811981b321fcfb023b5b1ee7f8ae9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 25 05:27:12 2018 -0500

    Move mesh generation from DepthBuffer to Mesh class.

[33mcommit 1b1262814007471c82ad8f5411335e474db5dcfc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 24 17:16:04 2018 -0500

    Update ToDo.

[33mcommit 328fcf216af841caf95932a0ad510040aaeb576f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 24 17:03:43 2018 -0500

    Add Mesh class which has responsibility for relief generation.

[33mcommit f45f58dbd30e7a69d97523af6a04e3706354d807[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 24 15:38:37 2018 -0500

    Construct Mesh in ComposerController (rather thatn DepthBufferFacrtory) as a prelude to the Mesh class.

[33mcommit 4996b77fb3089c80026a5eda37efe073cc3b3cdd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 24 13:34:41 2018 -0500

    Implement HTTP status codes.  https://www.npmjs.com/package/http-status-codes

[33mcommit b70c5d11592df4da156ae45b5be4f700daf2b1d1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 24 11:18:58 2018 -0500

    Implement Http.submitRequest and Http.postFileAsync.
    All FE DTO fields are lowercase.

[33mcommit e65ada8c32a926b5c9529e2bcbb26ccea142b089[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jan 22 07:19:12 2018 -0500

    Refactor front end DTO interfaces to depend only on other interfaces.
    Introduct DtoModels module which holds all DTO objects.

[33mcommit 204b5400392fde72c801eb897881cf0503861127[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jan 21 06:49:30 2018 -0500

    Decouple RunTask from RunPythonTask.

[33mcommit 0be2eb804b4018c7c621083d0acf08d050cf8c32[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 20 17:56:04 2018 -0500

    Add integration test FileRequest_MeshGenerateScalesDepthBufferByLambdaLinearScaling.

[33mcommit 8287b67956746cd27c763bede0e411adb8b737ee[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 20 10:20:42 2018 -0500

    Replace Mesh file after completion of GenerateMeshAsync.

[33mcommit 30e0360b6972f9783a2e4dbbe8a1ab58500feae5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 20 09:51:58 2018 -0500

    Refactor Solver unpack_floats to return a simple list rather than a list of tuples.

[33mcommit 3288f5d692c07f96b05a89ad1d6e70e26254427a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 20 09:27:39 2018 -0500

    Add Mesh class.
    Solver names output mesh based on JSON Mesh.Name.
    Solve create working folder if it does not exist.

[33mcommit b547e1e7b478fde6cc65f01dd0b8ac11b22ffa2e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 18:22:05 2018 -0500

    Resolve absolute path in Solver.pyproj.

[33mcommit 9ae92862028d1081e287fb167c5223c951590523[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 17:48:30 2018 -0500

    Extend DepthBuffer with write_bytes method to write a raw buffer.

[33mcommit c4e9c19800ac9f78ca6c39eacbd71d783699e06d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 15:45:05 2018 -0500

    Refactor Solver to move methods to DepthBuffer class.

[33mcommit cdc97e867d89921bffc6cd2b051b3c434710ef30[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 14:41:35 2018 -0500

    Add -working option to Solver.

[33mcommit c61707b3fd5f560bb38a3050efeaaca71f88093a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 14:15:10 2018 -0500

    Initialize Solver, DepthBuffer and MeshTransform classes with JSON settings file.

[33mcommit 4c6941d68d194ffc83a6048cb69a5f1cbad905da[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 10:38:38 2018 -0500

    Exclude User property from JSON serialization.
    Move test model Name assignment to concrete classes so the names can reflect the type (not generic "Test Model") and include an extension.
    Normalize Path in PostFileRequestHandler.

[33mcommit f1ae9ea7c4c441d2288520d4ce67d48f5e796846[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 10:03:50 2018 -0500

    Remove .gitignore entries for *.obj and *.raw. GitHub allows up to

[33mcommit 95528a4616ea4fa161e1602a6e5ba9a6f5970ef4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 09:54:04 2018 -0500

    Add DepthBuffer.raw to Solver\Test folder.

[33mcommit f979f19b0d9eec55f99cc49176350858a367b22c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 09:42:14 2018 -0500

    Rename appsettings ResourcePaths to Paths. Add Paths.Working to define the location of task working files.
    Pass a JSON representation of the expanded Mesh to the Solver.

[33mcommit 7ffeeff07161ddffaa2a0886a55f78250a158be0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 19 05:10:11 2018 -0500

    Rename appsettings ResourcePaths to Paths. Add Paths.Working to define the location of task working files.

[33mcommit 732ea076312f0f4525dcaf6d7759f6741c1073a8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 18 15:49:23 2018 -0500

    Solver: Move DepthBuffer and MeshTransform to depth and transform modules.
    Remove fileName parameter from FileRequest methods. It is available through FileDomainModel.FileName.

[33mcommit dfbadd103dbb1245faecf6e90a2ba7b04b454cdb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 18 07:08:31 2018 -0500

    Frame test generator Scalar.py.
    Share .pylintrc.

[33mcommit 0a0c3514fe483176024ccfb7eb1daa7ceed1f4f9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jan 15 16:13:03 2018 -0500

    Add Raw option to Mesh.Format.

[33mcommit f532bc2801b63b3a8c36161a58d4b81973102e5e[m
Merge: e317b82 607dd63
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jan 15 07:30:24 2018 -0500

    Merge branch 'master' of https://github.com/steveknipmeyer/ModelRelief

[33mcommit e317b8291ef47806f8fa7b09b9568575066fa7e7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jan 15 07:30:18 2018 -0500

    Add Python lint checking.

[33mcommit 607dd63859dc0b65dc5feffe58716c2d2a268334[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jan 14 19:16:49 2018 -0500

    Update ToDo.

[33mcommit e840c1eefbb8189ec34d64eb76f4f06e1d42b47f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jan 14 17:29:55 2018 -0500

    Rename Solver.

[33mcommit 6533329397b97c4fa030c3908f45df3de995d803[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 13 11:48:46 2018 -0500

    Experimentation with RunPythonTask.

[33mcommit 85f74d71bbdf6c1ec861d0f75906b26439e953d2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 13 10:39:06 2018 -0500

    Schedule a FileRequestGenerate only when FileIsSynchronized has become true and FileTimeStamp has not changed.
    This allows a GeneratedFileModel to be updated though POST without trigging a FileRequestGenerate.

[33mcommit affde3fa45686e94737bf03012514ec70ecea130[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 13 09:33:38 2018 -0500

    Frame Dispatcher (IDispatcher) to handle long-running file update tasks.
    Add PostFile_FileTimeStampIsUpdatedAfterFileIsPosted to verify timestamps are updated.

[33mcommit 17f2a6e3f4a4549c2f07a06e4f906735e19079eb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 12 17:10:05 2018 -0500

    Update ToDo.

[33mcommit 0851dbf9c6062bfd2f6bfcb65a9d415a03ef650a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 12 14:47:51 2018 -0500

    Add README.

[33mcommit e8ae226f214e2ad2ace2d78224c6a3d237d6ff49[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 12 10:49:42 2018 -0500

    Markdown experiments.

[33mcommit d18a673d08891329d61fb196433eb39e1d7c4d79[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 12 08:27:02 2018 -0500

    Rename DepthBuffer.Model -> DepthBuffer.Model3d to support convention-based navigation properties.
    Add Thread.Sleep to FileRequest_MeshIsInvalidatedAfterDepthBufferFileBecomesUnsynchronized().
        N.B. DateTime.Now yields 1 second accuracy so the resulting timestamps betweeen an initial and modified file event may be identical!

[33mcommit f72d81654c53dd4be96f91352586a40a89273e52[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 11 18:29:22 2018 -0500

    Implement FileRequest_MeshIsInvalidatedAfterDepthBufferFileBecomesUnsynchronized.

[33mcommit f28070dde7ceb2c38e51fe7cf635167c0365084d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 11 10:50:16 2018 -0500

    Implement FileRequest_DepthBufferIsInvalidatedAfterCameraDependencyPropertyChange.

[33mcommit 04307ee1452a5e90fb108a64ab4456721863c635[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 11 09:43:54 2018 -0500

    Refactor ITestModelFactory and ITestFileModelFactory to use ITGetModel rather than TGetModel.

[33mcommit bad6c662efb9035533f24c2d04f9903a0a5e58e3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 11 04:50:36 2018 -0500

    Specialize TestModelFactory with TestFileModelFactory to handle DomainFileModels.

[33mcommit fb26ea3abdb395babc16b5cb1628ecce846add68[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 10 17:38:42 2018 -0500

    Refactor TestModel -> TestModelFactory.
    Methods for PostNewModel, DeleteModel PostNewFile, PutFile are now in TestModelFactory instead of BaseIntegrationTests, FileIntegrationTests.
    Add Utility class for helper methods to Test project.

[33mcommit c587de91b43c6cc0f4d336a2787d60568676ceb3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 10 15:02:38 2018 -0500

    Implement FileRequest_FileCanBeReadAfterRename.

[33mcommit 67350e5b367da3c3e73c8d05b91f3b5e1cd4dd49[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 10 10:51:09 2018 -0500

    Introduce PropertyNames to define the key domain model property names (e.g. "Name", "FileIsSynchronized");
    Introduce a GeneratedFileProperty CustomAttribute for a required property for GeneratedFileDomainModels.
    These are verified during the FileOperation.Generate.

[33mcommit ab1dd17a9a044cbccbccd56f7fe71d8e15e0a1b5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 10 09:14:41 2018 -0500

    Resolve StyleAnalyzer "SA1214:Readonly fields should appear before non-readonly fields".

[33mcommit 2667205ddd3ef6c2d838c2a9e5261b82eb391e85[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 10 07:09:18 2018 -0500

    Resolve StyleAnalyzer "SA1401:Fields should be private".

[33mcommit a881d13e27c1f22cfa8ee6db15f2d60e6d3d3d3d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 10 06:47:54 2018 -0500

    Resolve StyleAnalyszer "SA1649:File name should match first type name".

[33mcommit a0636eab3811a92f61d3a7488aeb76961c9ff867[m
Merge: 4ec223c 2a1ea19
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jan 9 17:44:47 2018 -0500

    Merge branch 'master' of https://github.com/steveknipmeyer/ModelRelief

[33mcommit 4ec223c9ee80a76e18f5b0e978b4401455a7de01[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jan 9 17:41:01 2018 -0500

    Update Solver to use a path relative to __file__.

[33mcommit 2a1ea1918be929f00923b541279e14bc04b10b6a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jan 9 05:25:16 2018 -0500

    Rename MappingProfile.cs to <DtoModel>.cs. The DTO object is the dominant type. The type MappingProfle is discovered by AutoMapper.

[33mcommit 17448e48401b571af390abec31aa354d622ad879[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jan 9 04:32:47 2018 -0500

    Resolve StyleAnalysis warnings.
    Change ModelRelief project Build settings to use latest minor version of C#A compiler.

[33mcommit 570846ec64231ab334fa5422413ffe09802b9a07[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 6 11:07:28 2018 -0500

    Implement support for post-processing  in the DependencyManager. Added entities are deferred so that the primary key will have been assigned.

[33mcommit bb9ab86525d11e75d0823a775e90f1df59f510aa[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jan 6 05:49:46 2018 -0500

    Implement ProcessDeletedEntity.
    Implement FileOperation.Rename.
    Refactor invalidation logic into InvalidteDependentModels.

[33mcommit 2825eeabaf367fdd5eb78f5dcec1449273b9a63c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 5 17:42:57 2018 -0500

    Add ConstructFileRequest to construct a FileRequest through reflection.

[33mcommit f888439363eab69e4f413fa078e95dcdcb34172b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 5 16:46:24 2018 -0500

    Refactor the DependencyManager processing to construct collections of IFileRequests.
    Add framework for generating FileRequests for Rename and Generate.

[33mcommit cbcbb0fc9ea1c98d1f09e626875193aa1720c8b2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 5 08:36:45 2018 -0500

    Use reflection to call generic methods (ModelExistsAsync, FindRootDependentModels) with dynamic types.

[33mcommit 24b440125a4e39d8753a0ffc601889f66f769602[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 5 07:03:32 2018 -0500

    Convert ILogger to ILoggerFactory and construct ILogger (and Category) in base class.

[33mcommit 5307710a6bb5620410ef4a72751658e4dbced3b4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 5 05:40:25 2018 -0500

    Refactor ApiController to consume ILogger<ApiController<TEntity>>.

[33mcommit ad29df02dae910be0cdd4b62cc44ff82d6c0c6a3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jan 5 04:45:00 2018 -0500

    Add MeshFileRequestHandler and DepthBufferFileRequestHandler.
    Change FileRequestHandler from abstract to concrete.
    Cosmetic refactoring of Api constructor parameters.

[33mcommit 5992f61a7ce8038478a49e5a689cf1933f578977[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 4 16:29:13 2018 -0500

    Add FileRequest and FileRequestHandler.

[33mcommit 466fea003a9d88a4084f5100976f7834ce6d06e3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 4 09:30:23 2018 -0500

    Remove DbContextTransactionFilter.
    Explicit transactions should not be necessary as DbContext.SaveChanges(Async) employs transactions internally.
    Moreover, exceptions thrown by asynchronous tasks (e.g. await next()) are swallowed so the catch block is never reached here.

[33mcommit edee44476a17b38bada7d9b1b480d16770127866[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jan 4 05:06:36 2018 -0500

    Add additional DependencyManager unit tests.

[33mcommit 7b07979e9dc7c010f4e3e7e6cf62b86daa85c245[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 3 17:41:33 2018 -0500

    Add additional DependencyManager unit tests.

[33mcommit 38397255a9eacaf6338ccdf39c8068ecbf1b33ac[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jan 3 15:55:20 2018 -0500

    Refactor automated tests to share common classes (ClassFxture, DatabaseFixture, ServerFramework) between unit and integration tests.

[33mcommit 4e40e87d3c4d1a1009f1bb8f3f9c539821bb3f52[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jan 2 05:56:21 2018 -0500

    Recursively find dependent models in DependencyManager.FindDependentModels.

[33mcommit cc272ba81b8ea0005aeac7784518966ef6274d03[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jan 2 05:16:49 2018 -0500

    Add  new overload for DependencyManager.FindDependentModels  (independent of TransactionEntity) to support recursion.

[33mcommit 0cee2ba60fe5b0db7a491a06d56603cdb528d3a4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jan 1 14:41:30 2018 -0500

    Extend DependencyManager to find <first> level of dependencies from the ChangeTracker.

[33mcommit 00e5a94bba1e115a03a1db96b2e446250b876edb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jan 1 07:31:41 2018 -0500

    Refactor DependencyManager to add separate processing steps for  Added, Modified and Deleted.

[33mcommit 0dec95a6afb0b84a89727b196209e182c4477186[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 31 15:29:48 2017 -0500

    Extend DependencyManager with PropertyHasAttribute and ClassHasAttribute to find CustomAttributes.

[33mcommit 911886d913919841fbf472ff988cf5719eaf4c86[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 31 07:58:53 2017 -0500

    Add DependentsAttribute (CLass) to specify the dependent classes of a model.
    Dependents will be used by the DependencyManager to recalculate dependent files (e.g. Mesh = Mesh(DepthBuffer))
    Remove the FileDomainModel FileIsGenerated property. This is now expressed through the Dependents attribute.
    Add GeneratedFileDomainModel class for those file-backed models that are generated from dependents.

[33mcommit 7fd1b35a947396da4747545b53715388e3cfac5d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 31 04:13:23 2017 -0500

    Update copyright dates.

[33mcommit 1d99416d164fb70cfb7f45b5d53486c5a6f51bcc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 30 15:56:25 2017 -0500

    Extend FileDomainModel with additional properrties: FileIsGenerated, FileIsSynchronized, FileTimeStamp.
    Update FileIsSynchronized during the PostFile request handling.

[33mcommit ea04c3ec136f651268629ede12b91830eacea77e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 30 13:02:55 2017 -0500

    Replace DbContest.SaveChangesAsync with DependencyManager.PersistChangesAsync.

[33mcommit 1e02f3cbe6e54c48f43680c6f652ba34cd5983a9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 30 10:21:47 2017 -0500

    Add StorageManger to DI container.

[33mcommit 500ded7fe378052e1fb6884948c676738ec5cf2b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 30 07:05:50 2017 -0500

    PutRequestHandler did not uset AutoMapper overload to map from TRequestModel to TEntity so properties could be dropped.
    Implement DbContext.SaveChangesAsync as asynchronous.

[33mcommit d35b9e14ec511002cb14de260e6346a0693cbc91[m
Merge: a7e5d50 3c514af
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 29 19:49:44 2017 -0500

    Merge.

[33mcommit a7e5d50907ca3da04fad7170ac787371f1029b1b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 29 19:46:44 2017 -0500

    Update ToDo.

[33mcommit 3c514afc4969a8d1a58c85bd5c84342ade626959[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 29 19:43:24 2017 -0500

    Initial implementation of DbContext.SaveChangesAsync to support change tracking.

[33mcommit f08b703ed6e157657e57e228b0eab856749f2005[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 29 11:02:11 2017 -0500

    DbInitializer controls database initialization through InitializeDatabase environment variable.
    Resolve issue with directory separtors in DomainModel.GetRelativePath.

[33mcommit bdedf2cdd02e18e6ae023b4bad9290f5216dcacd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 29 07:05:17 2017 -0500

    Remove ModelRelief Tools folder; merge with Tools project.
    Complete Baseline tool.

[33mcommit d3cde7b72a14e647a1f984ee012ef7c73addd0bd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 28 17:45:55 2017 -0500

    Create Baseline.py to create a copy of the Test database as the baseline database for integration testing.

[33mcommit 102f0921f8fbab174dd9cae1d6d01991a679277a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 28 15:32:53 2017 -0500

    ApiStatusCode -> ApiErrorCode. It always represents an error condition.

[33mcommit cbf6af903965b89846df43fc4d39aa11eaa3c150[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 28 15:18:07 2017 -0500

    Skip read-only properties in ValidateReferences.

[33mcommit 744e8b1d2d3471b1da30e40bedc927b086dacd6b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 28 06:54:01 2017 -0500

    Add Tools project for Python build tools, etc.

[33mcommit 022b007bac8c54a69303e705c03445b578998915[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 27 18:13:50 2017 -0500

    Introduce new configuration setting ModelReliefDatabase to define the database provider (SQLServer, SQLite).
    Refactor Framework.RefreshTestDatabase to DbInitializer.SynchronizeTestDatabase.

[33mcommit 73268b4cb66aa816feb889a106b6ca36eb643979[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 27 08:39:39 2017 -0500

    Enable deletion of folders in DeleteRequestHandler.

[33mcommit c1fdfc8a3d35025dfa0edda465ce101298e82ca9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 26 16:58:57 2017 -0500

    Refactor FileDomainModel.GetRelativePath to take a parameter for the store/<configration>users root.

[33mcommit bb058426875a513f654cc998f5d0c880870020bc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 26 15:21:53 2017 -0500

    Add FileDomainModel to represent a file-backed model resource. Remove IFileResource.
    Add the StorageManager to provide storage services for models.
    DbInitializer : Set the path of all file-backed resources.
    Normalize the database path using Path.GetDirectory.
        All Path properties end with a directory separator.
        All Paths are complete and absolute.

[33mcommit a4774726c96040c918ad21c7c390461053d1372e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 26 06:25:46 2017 -0500

    Use  Path.Combine to compose paths from folders and file names.

[33mcommit a9618a7d0f3dc295b4ee8b7a156975be6d03e0d0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 24 11:29:14 2017 -0500

    Refactor PatchRequestHandler to move BuildUpdatedDomainModel and BuildUpdatedTGetModel from PatchRequest.c
    ValidatedHandler: FindModelAsync now throws EntityNotFoundException by default.

[33mcommit 7243ed0e840b2e4021f396d64f89600f2f30e62f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 23 12:00:48 2017 -0500

    GetFile, PostFile check IFileResource before processing.

[33mcommit 220739472d857ad729eb736e3d596599f045ba8d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 23 06:18:58 2017 -0500

    Extend DeleteRequest to remove the associated file and user storage.
    The model resource must satisfy IFileResource, the file path must match the model storage folder.
    The model storage folder is deleted only if it is empty after deleting the model file.

[33mcommit ddc445361eaedfbea1e23c3f8971c10782069227[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 22 07:09:53 2017 -0500

    Retested SQLite. SQLServer is 4X faster for integration testing.

[33mcommit bacb4b7f6229414747e1770b576682545df372d7[m
Merge: c38b64f a476159
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 22 06:45:48 2017 -0500

    Merge branch 'master' of https://github.com/steveknipmeyer/ModelRelief

[33mcommit c38b64fc352c86ba6a5c83db6afee2e3e474e8c4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 22 06:45:37 2017 -0500

    File integration tests: PUT supports file creation.
    Add GetFile_FileCanBeRoundtripped.

[33mcommit a476159df0652c905ab08db6cc8b92eb34d55ceb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 21 18:11:43 2017 -0500

    Update ToDo.txt.

[33mcommit a50b3a3c4fb714ae05db9ffee80a8689fe970df7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 21 17:14:07 2017 -0500

    Correct extension of log file in RefreshTestDatabase.

[33mcommit 40f1dadf1b61bc7ef58684a766c0b7f9bc9cb419[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 21 16:41:11 2017 -0500

    Modify all integration tests to be non-destructive.

[33mcommit 10016ae19fe07b89458f01bf0cdf9252ca3c57e9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 21 12:43:29 2017 -0500

    Switch to SQLServer.
    DbInitialize.Populate is now async (Wait() from Main).

[33mcommit 2732fe633c2359e2b05dff2b59857ae0a0a447ad[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 21 10:40:20 2017 -0500

    PostFile integration test: File can be posted.
    PostFile integration: Mesh endpoint is disallowed.
    Add test mesh files (UnitCube.obj).

[33mcommit 512d0501caeec3cb223a52bab61090318a268a49[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 21 06:27:23 2017 -0500

    Resolve Razor compilation errors during integration testing by copying .deps.json file.
    Refactor AssertApiErrorHttpStatusCode, AssertApiErrorApiStatusCode to IntegrationTests.

[33mcommit aecda078bcaca67ca5718324144bafbc7b2e7d59[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 20 16:01:07 2017 -0500

    Introduce top-level IntegrationTests to support both Base and File integratoin testing.

[33mcommit 71a8834a5c1ecff693137525acc8a64d5195d431[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 20 15:27:16 2017 -0500

    Introduce TestModel to encapsulate the properties of a test model for integration testing.
    TestModel will shared by the Base and the File integration tests.

[33mcommit 05ea531bd862bc5301db0fb3e335d052df1850ed[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 20 13:40:34 2017 -0500

    Update FirstModellName in test classes to include extension.

[33mcommit 53e6be63621f589fcf3f2db85244002814f2e8cf[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 20 11:16:58 2017 -0500

    Add test files for DepthBuffers to support testing.
    File names in the database now include extensions. If needed, the extension can be removed from Views.

[33mcommit 53f55214fafa54ad2e9f85a0e0ca5cb9fd2dfc04[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 20 06:40:51 2017 -0500

    Disallow the invalid endpoint : Mesh PostFile.
    Add Patch method to the ApiValidation error handling.
    Rename file ApiValidation ApiErrorResult.

[33mcommit e0c1c5f1a46286a4c31b1473c6b373d67cf8bbfd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 19 17:24:26 2017 -0500

    Add logging to RequestHandlers.
    Add IConfigurationProvider and IHostingEnvironment DI to ValidatedHandler.
    Move helper methods for ModelStorageFolder and ModelFileName to ValidatedHandler.

[33mcommit 9e7daaa0f826efb140c169a2dae3917f0d869a9b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 19 16:12:08 2017 -0500

    Add support for deleting the model storage folder after a DeleteRequest.

[33mcommit 1d30fca013387eb4cd0ce2f5c130a62fcb8cf3b6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 19 15:03:29 2017 -0500

    Implement GetFileRequest.
    Add helper Files.ModelFileName to return a disk file associated with a model.
    Disable saving the mesh file. It is likey that it will be more performant to transport only the (much smaller) DepthBuffer and do the mesh generation as needed.

[33mcommit 95288ad83772024ad797e2a7eefa865312764d62[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 19:10:41 2017 -0500

    Prototype GetFileRequestHandler.

[33mcommit a86fdac0264a71e15bac326eb2bfce6fa3a65ef1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 16:47:46 2017 -0500

    Frame GetFileRequest.

[33mcommit e7cf84082573a95c1403a538e14ff1f109212f9d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 15:41:25 2017 -0500

    Post JSON metaadata first followed by binary file data.
    The file data is posted to the newly-created resource/id/file endpoint.
    Change the location header to reference the file not the metadata.

[33mcommit a4d8c0ad3c5f5a2cfdd4218c8eb0a169952378dc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 10:43:12 2017 -0500

    Rename TPostModel -> TRequestModel to reflect the dual service for both POST and PUT requests.

[33mcommit 56202a5c7de163e792163561951926b674152c1d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 09:58:18 2017 -0500

    Rename GetRequest -> GetListRequest.
    Remove ITGetModel interface from TPostModel type paramter.

[33mcommit 1eeca749e064b921ded65ddcfb8c52ae549ff393[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 09:23:50 2017 -0500

    Refactor PostAddRequest -> PostRequest.

[33mcommit acaf36acecc3c173e605840459412c1a67f90248[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 09:04:23 2017 -0500

    Refactor PostUpdateRequest -> PutRequest.

[33mcommit 9694d18fe812b777e0fb14160ce11072085279a2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 07:20:52 2017 -0500

    Refactor PutRequest -> PatchRequest.
    Patch requests can be submitted in two ways:
        PATCH <resource>/id
        PUT <resource>/id/patch
    This allows APIs that cannot generate an HTTP PATCH to still pefroem partial updates.

[33mcommit f5523e4dc93ae67ca516925e339a1ecf8ac0394b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 18 04:24:18 2017 -0500

    Organize controller actions by function.

[33mcommit 0edd7df8020da206d9b292eb62989e26ba460039[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 15 15:40:17 2017 -0500

    Complete remaining test collections (Camera, Model3d, MeshTransform, Project).

[33mcommit 274c5deacbf0dd7de9bc84bb80e268ce38fbd765[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 15 15:19:17 2017 -0500

    Complete Mesh and DepthBuffer test collections for BaseIntegrationTests.

[33mcommit dbd6c611791afd468c928e97b7ce85a7f8c77339[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 15 11:39:22 2017 -0500

    Further expansion of BaseIntegrationTests.

[33mcommit 153911744b4e2acf65665713f68045efa17c1a3d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 15 10:08:51 2017 -0500

    Expand BaseIntegrationTests.

[33mcommit 6de9555e9ceda14c774f58d6a43c7564809cb181[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 15 07:51:53 2017 -0500

    OnModelCreating: Change default DeleteBehavior behavior to SetNull.

[33mcommit 97d8dbedb69a993b029b271f7db89def91290e71[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 15 07:19:42 2017 -0500

    Replace IIdModel with ITGetModel to support common properties for integration testing;

[33mcommit 87e74b7c67de4339cf6fe2fa3a5a7f271a7b464c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 15 07:00:04 2017 -0500

    Introduce abstract base class BaseIntegrationTests for testing.
    ValidateReferences: If there are errors, stop tracking the model. It is invalid.

[33mcommit 504b8e6b33d3287e302cf4971c03fd89189bb03b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 13 14:38:35 2017 -0500

    Complete controllers for Api:  Camera, MeshTransform, Model3d, Project.

[33mcommit a4ab7a773e46270bd3a0e4d8610eb1d54d30b528[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 13 13:59:53 2017 -0500

    Add Project Views.

[33mcommit 74b095fdf58c3428934fa9309c2ae27f70b92065[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 13 13:44:31 2017 -0500

    Add MeshTransform Views.

[33mcommit 1db40217bf1860547e0f227d9a942193adb07b0d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 13 12:04:38 2017 -0500

    Add DepthBuffer Views.

[33mcommit 4fbc03ebacfdfc3578cdb1ec884250336a55505b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 13 11:25:12 2017 -0500

    Add Camera Views.
    ViewController: Construct default instance for Create action.

[33mcommit f2f148629ff5f3db0dc3fca3967f3d89dc95f947[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 13 05:51:45 2017 -0500

    Refactor middleware authentication for testing in Middleware.Authentication.Test.

[33mcommit 0f5ea26802a1f79c80ed275e93d95ec52371db7e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Dec 13 05:31:05 2017 -0500

    Update ToDo notes.

[33mcommit 3b142eb839a7d28f6bf06e67cfe4d8983938da99[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 12 16:09:26 2017 -0500

    Create a helper method in MeshesIntegrationTests.
    Add test for multiple invalid reference properties.

[33mcommit 12bfee504f9c4e887e8a22f3144cca7a8b20b406[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 11 17:29:10 2017 -0500

    Add ValidateReferences method to ValidatedHandler to validate that all non-null reference properties are owned.

[33mcommit 5b47e2a25dc103c6481ff588d429b13268d8ccd8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 11 09:32:29 2017 -0500

    Add helper methods (FindModelAsync, ModelExistsAsync) to the base ValidatedHandler.

[33mcommit 1b1d511e89fa785b9bdcb35376c6420e42db5005[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 11 05:52:45 2017 -0500

    PostUpdateRequest: Add Id property for consistency with other requests.
    GetSingle, PutRequest and DeleteRequest include the Id property.

[33mcommit 1c0ab0cc9b1afb4a1ca25828df1a1be693c3a369[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Dec 11 04:34:49 2017 -0500

    Added User property to Viewer action in ModelsController.

[33mcommit 1c1e4625ca5abee563176dd95bce5169da0b7860[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 10 17:36:45 2017 -0500

    Api PostUpdate sets Id from request paramaters. Ux PostUpdate always contains Id in PostModel.
    Document RestController action methods (PostAdd, PostUpdate, Put)
    Add a test object Factory (Valid, Invalid)
    Introduce constants for valid ranges, invalid ID value.

[33mcommit 4213e981f59922f3aa694dd2123a5f4b1926c3fa[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 10 11:29:50 2017 -0500

    Add ServerFixture for integration tests to reuse the Framework TestServer.
    Add Clipboard.cs.
    Add PostUpdate integration tests.
    Add Delete integration tests.

[33mcommit f7eef4224d30962ca4bf015d740891ef8fc45528[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 9 16:10:59 2017 -0500

    ApiResult -> ApiErrorResult
    PostAddRequestHandler: When a resource is created, the User.Id must be set.
    Assign Mesh.Format in DbInitializer.Populate.

[33mcommit 782f42556afcc80a10679e15799caac6239d3ebf[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 9 09:35:39 2017 -0500

    Include User property in all requests.
    Add UserAuthenticationException and supporting error page for Views.
    Validate ApplicationUser in Identity.GetApplicationUserAsync; throws UserAuthenticationException.

[33mcommit fd75f7ac3e61397f19f04af5cace52fcf399bd5e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 8 16:15:42 2017 -0500

    Add UserSecrets support to IntergrationTest Framework.
    Add custom middleware for MockTestUser authentication.
    Identity.GetCurrentUserAsync now assigns the test@modelrelief.com user ID to the "MockTestUser" GenericIdentity.

[33mcommit 685e23624410f9aa8a17a7b2e4e39ffec418b6b3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 8 05:12:43 2017 -0500

    Add UserManager DI to both UxController and ApiController.
    Add FindApplicationUser method to RestController and ViewController.
    Reference properies in Views are now populated only with owned resources.

[33mcommit 2c5e628721745331880db496e226ac23904a6642[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 7 15:29:51 2017 -0500

    ModelReliefShell: set MRSolution and MR relative to batch file so the environment is computer-independent.

[33mcommit 4299873ad3ac1f45cdef0272a5790b1643009e61[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 7 15:06:06 2017 -0500

    Remove Path property from Mesh Detail and Delete Views.
    DbInitialize: Qualify Description with user name to aid implementation development of per-user resources.

[33mcommit 1f43e14d3b112b0de34b2ca1a9576b1be75de998[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 7 11:04:18 2017 -0500

    Add DeleteConfiguration batch file to delete the database and user files for a given configuration.
    Generalize CopyTestFiles to handle other file types.

[33mcommit fb9decd7817c2057a363787388bfdcfc45dd1c1e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Dec 7 08:02:36 2017 -0500

    Generalize test data users to remove model Ids These are dynamically generated by DbInitializer.Populate.
    Add Tools folder.

[33mcommit d67f1f3e380c85ca4705491ec045f1a0bc4dc199[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Dec 5 05:46:40 2017 -0500

    Implement User Secrets.
    Extend configuration to include UserSecrets for all environments.

[33mcommit 2ae9e0b9a5729c63d9bd50042a29d2c579e62471[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 3 11:57:30 2017 -0500

    ModelReliefModel -> DomainModel.

[33mcommit f94bbe38ab5ea81e486c37f9cfb4edca6ed09fa1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 3 11:24:46 2017 -0500

    POST methods now return Created(201) when successful instead of Ok (200).

[33mcommit 3a19e6f35b790ded684281fbd9daeec76e7abeeb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 3 10:03:39 2017 -0500

    Add support for refreshing the test database from a baseline copy. The parent class (MeshIntegrationTests) does the work in the constructor before any tests are run.

[33mcommit c4baccfba1319fe295098541b2fd129bf4381c29[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 3 09:09:38 2017 -0500

    Condition database name and user store path on environment name. For example, Test will use ModelReliefTest.db and /store/test/users/.

[33mcommit c533d4471cf99659b136fa24b877c9c7ba141c96[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Dec 3 07:07:03 2017 -0500

    Introduce environment-based appsettings.json to allow different ConnectionString settings to be used for testing.
    Remove Path property from Model pages.
    Package HttpReponseMessage and reponse string into RequestReponse for integration testing.

[33mcommit 6cb97a6f93cf9cb1291d041a7f098b51820e1bd4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Dec 2 17:11:35 2017 -0500

    Frame new Mesh integration tests.
    Resolve an error in PutRequest.BuildDomainModel where an invalid property name causes an exception.
    Resolve an error in which an invalid enum (string instead of an integer) causes an exception.

[33mcommit 57ee9fd2b18689c313ae80a573fd63bfe3dd4cce[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 1 16:56:30 2017 -0500

    Migrate from ApiV1 to ApiV2.

[33mcommit b4dcde9cf4e460022b26dc2317b69689325e360d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 1 10:38:55 2017 -0500

    Initial implementation of PostFileRequestHandler.

[33mcommit 90478195555cad80d0903c548e7de2242410e7e7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 1 09:25:39 2017 -0500

    Simplify generic type parameters for PostFileRequest. TPostFile removed.
    Add shared folder for DataTransferObjects.

[33mcommit dd23ecaee35f6240ea8e7928b0893b1d588ca454[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 1 06:53:22 2017 -0500

    Treat warnings as errors.
    Enable XML documentation (but do not require documentation on types and members).
    The documentation will be checked for consistency but is not required.

[33mcommit b40025a11f44dd12b9dc7cc59a385ec2c8aea903[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 1 05:38:35 2017 -0500

    Add additional DI services necessary for handling file system requests.

[33mcommit d0ca79f90e42065c2fa52de36b55949b1e5bacac[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Dec 1 04:24:34 2017 -0500

    Return Location of new resource as an absolute path without using a query parameter.

[33mcommit f4f9fc2ded9730aa78bb0953f048b646cb794299[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 30 16:57:14 2017 -0500

    Set the Location header for POST requests.

[33mcommit 9aa22b9f243cd3dea0e96263a87f45a5f22c6b25[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 30 15:48:04 2017 -0500

    Change ValidatedHandler.PreHandle to use async and return null (Task). It is always called with await so it must always be async.

[33mcommit 508d4b5c29b50016ecb4404da608e43d040d69db[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 30 11:10:43 2017 -0500

    Add PreHandle method to ValidatedHandler to allow request to perform any necessary setup such as constructing a DTO (PutRequest) before validation and request processing.
    By doing the initialization in the ValidatedHandler (instead of the RestController), the normal ApiConttoller exception handling can be used to return an ApiValidationResult.

[33mcommit 2520aed6e02b1472050ad471999e6283fd2aa7be[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 30 07:59:12 2017 -0500

    Exapand all models when returning GET(single), POST or PUT results.
    Handle Nullable types in PutRequestHandler.

[33mcommit 132edec29d192042b9a28b5226364b47598825dd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 30 06:01:40 2017 -0500

    PutRequset: BuildDomainModel and BuildUpdatedModel are now async.

[33mcommit 3348398511eb8d66df4a9c9a4e562fddbfcfa7a4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 30 05:30:20 2017 -0500

    Use FluentValidation ValidationResult.Errors to compose ApiValidationResult not ModelState.
    Theory: the model-binding does not happen because there is no validator for the PUT parameters. Other requests have a Dto.Mesh (e.g. TPostModel) parameter so the FV AbstractValidators are found.
    Refactor ObjectResult to use the ValidationResult.Errors not the ModelState.Errors.

[33mcommit cbae420e6c4f97731550a24077dd64b5dc688e3c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 30 04:48:25 2017 -0500

    Initial implementation of validation for PUT requests.

[33mcommit e580866907289f25626d2c2031a015da211a48cd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Nov 29 04:04:43 2017 -0500

     Refactor ApiValidationHelper.MapRequestToApiStatusCode.

[33mcommit 51a816b4431a23f213bb12541c65e6123a2d87a1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Nov 28 07:54:30 2017 -0500

    Implement mapping from an HTTP request and domain model to an ApiStatusCode.

[33mcommit ab0c981424749b075e006a4cac84d6a2dd0792b6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Nov 27 05:46:32 2017 -0500

    Refactor API error handling to use ApiValidationResult.

[33mcommit cf5179a53a2574d4c23192b828ee760acd2d95cc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Nov 26 08:41:37 2017 -0500

    Add a global exception handler along with an ErrorsController that serves custom error pagess.

[33mcommit 7bcdcd604e46fd5247ca45164856c7ed4b1c6361[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 25 17:26:28 2017 -0500

    Throw exceptions for bad requests from UxController instead of returning objects.

[33mcommit 9def91ef8f7013467e7982e314f986d50cbb5bcb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 25 16:05:30 2017 -0500

    Share DTO Mesh validation with PostAddRequest and PostUpdateRequest by using FV SetValidator in request validator.

[33mcommit b508ca8496eb01269df00f7a6607cf5858d700f1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 25 15:35:58 2017 -0500

    Differentiate between POST(Add) and POST(Update) by splitting POST into PostAddRequest and PostUpdateRequest.
    PostUpdateRequest is used by View Edit when an existing model is being updated.

[33mcommit fc0cf48c647eab8eef060947681f47bd806c2f95[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 25 13:15:08 2017 -0500

    Replace the ApiController base class with UxController.
    Replace the RESTController base class with ViewController.
    Remove ValidatorActionFilter.

[33mcommit ccf521de6e9dfdbb6c8cde68ca0da37120237500[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 25 05:25:12 2017 -0500

    InitializeViewHelpers -> InitializeViewControls.

[33mcommit 52b0e4f27cf614a8456b1a4766102ec90dd061db[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 24 11:23:54 2017 -0500

    ApiV2: Implement PutRequestHandler.

[33mcommit 847cba18b1c40f790165840201fe9a11e668022e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 24 11:01:30 2017 -0500

    ApiV2: Implement RestPostRequest and RestPostRequestHandler.

[33mcommit 5784213551794fe8d2d089cbb0293774e6634b25[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 24 05:46:31 2017 -0500

    ApiV2: Implement DeleteRequest and DeleteRequestHandler.

[33mcommit 500cea8c67955fa1a5ddda86c27b0d288a734da3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 23 16:41:34 2017 -0500

    Implement OrderBy and Ascending for GetListRequestHandler.

[33mcommit 3b71be9296c2b514bd58b2c5d9e599dd01f20ee4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 23 16:26:38 2017 -0500

    Implement paging for GetListRequestHandler.
    Add IUrlHelperContainer as a GetListRequest property rather than using DI to ensure getting the active controller.

[33mcommit e7eab9d9ef582e1ca23f2e4774af457e4a6d97af[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 23 15:35:33 2017 -0500

    ApiV2: Implement GetListRequest and GetListRequestHandler.
    Remove Area routes.

[33mcommit 00c31712dab8721a94227149f74615277e38a8c2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 23 05:41:10 2017 -0500

    ApiV2: Implement GetSingleRequest.

[33mcommit 2a0ef88af6719ea4f4f861e37c626049b9a636e9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Nov 21 07:29:45 2017 -0500

    ValidationActionFilter: Return ViewResult if ModelState is invalid.
    Resolve HTML validation errors.

[33mcommit e9294d40dc1d00b9defaaadf1179c891f34d6ff1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Nov 20 06:50:53 2017 -0500

    Refine FC rules in Mesh and Modle DTO objects

[33mcommit 9a488a7e4c834d4e36c2c6d053b40e8fb9c96afe[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Nov 19 10:13:13 2017 -0500

    Implement MediatR for Models Feature.

[33mcommit 5072c1b2b8ff781a712f88f895dae7e6cf23aa55[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 18 18:20:25 2017 -0500

    Use FV Include to chain rules from Dto.Mesh to Create.Command.

[33mcommit d6584a9d705a3e5643baf42b9aa39a6eb52c70bb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 18 17:20:18 2017 -0500

    Refine Mesh rules.

[33mcommit 2099b445ac256bdba4f818af2827f4b8a89f6ec5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 18 13:08:41 2017 -0500

    Introduce shareable DTO objects for CQRS processing.
    Make all navigation properties DTO objects.
        This will make the Display attribute available.
        It provides better security.
    Remove virtual modifer from Domain models. There is no need to override UX names with Display attributes.
        The Domain model is never used in the UX.

[33mcommit 9238edd91062fb8109d7ab745b0db878bfb23fb0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 17 14:16:57 2017 -0500

    Implement Mesh.Create and Mesh.Edit with the Project relationship property.

[33mcommit 2f8e95c62ebd6f6792d0335d8ab5adb3ed915098[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 17 13:47:42 2017 -0500

    Add primary key to all entity relationship properties.
    Change mock Id.

[33mcommit 0b8eb4bab07ae07e2d3c51a20ea1dfe7e6b3a3be[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 17 12:55:40 2017 -0500

    Include Project for Mesh Index, Delete and Details.

[33mcommit c9790176daf415ff6792e8ab51fbb6e66c07bae3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 17 10:00:55 2017 -0500

    Make several Mesh Handlers Async.
    Do not qualify Mesh Commands with Action.

[33mcommit c4a2d5c0f33d9e4c465fbeedb5dc67b6eb22c351[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 17 05:59:25 2017 -0500

    Implement Meshes.Edit.
    Remove deprecated files (IModelProvider, SqlModelsProvider)

[33mcommit 4d1b21a4923d2f4d0ddf5d5b7fac2cbc4b7f7a58[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 16 17:51:20 2017 -0500

    Implement Mesh.Create
    Add ViewHelpers with helper methods such as PopulateEnumDropDownList.

[33mcommit 78587e42f998bd37d9536966618548d4a7fa68ac[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Nov 14 07:09:45 2017 -0500

    Use Directory.Exists (not File.Exists) in AddStaticFilePath.

[33mcommit a8b08d995e7725cd0c42381cb25bb81351780b03[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Nov 14 05:30:07 2017 -0500

    Refactor database transaction to remove Rollback and add logging.
    Implement folder deletion in Mesh.Delete.Command.

[33mcommit fe5d86204228c0895fe338a5b9ca0bed9d2c453a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Nov 12 17:42:51 2017 -0500

    Update ToDo.

[33mcommit 9f020d3c9d1983f143d31e1be10f5fded8b3656f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Nov 12 16:08:15 2017 -0500

    Add database transactions using anIAsyncActionFilter.

[33mcommit 11c211622782064e9ced953550a19fecbac4072a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Nov 12 10:03:55 2017 -0500

    Complete conversion of API to use ModelReliefDbContext.
    Disable mock tests for API.
    It is difficult to mock extensions methods such as the EF ToListAsync.
    Jimmy Bogard and K. Scott Allen do not recommend mocking a DbContext.
    Instead, use integration tests such as those in ContosoUniversityCore.

[33mcommit b953040c013ee85a86bae342a397edc2eb3ede61[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Nov 12 05:59:15 2017 -0500

    Implement Meshes.Detail command.
    Move MappingProfiles into Features and API folders.

[33mcommit 3f35691af3880ca3b80ce466d9cd9eb761712611[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Nov 11 09:32:20 2017 -0500

    Implement Mediator pattern for Meshes controller.

[33mcommit a534b8375aa9a66b45b0701e99b0e71b4991d349[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 10 09:17:04 2017 -0500

    Add subfolers to all wwwroot\lib content.

[33mcommit 0bb52594acdf37d3b862a439ca17920fcb3f4dab[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 9 15:52:17 2017 -0500

    Resolve namespace issues with singular to plural migration.
    Site.css tweaks for colors.

[33mcommit 8d04450aee6e420c95d7630cf1091a1f97471397[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 9 15:30:51 2017 -0500

    Pluralize folder names to avoid namespace conflicts with types.

[33mcommit 17a9ae8dfdb0876675d49fb13c41c86c9017223a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 9 14:34:31 2017 -0500

    Extend gulp default task to copy dist folders for jquery, jquery-validation and bootstrap.
    Add environment blocks to _Layout to conditionally load CSS and JavaScript depending on environment.
    Add collapsible navigation.

[33mcommit 3b475b8efcf11567dab7a1af0d2b9bad09501aa9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Nov 9 05:59:03 2017 -0500

    Add Description to ModelReliefModel.
    Add DotNotCliToolReference to ModelRelief project to resolve 'dotnet ef' command line tools.

[33mcommit bc0acdbbefa09dc6f2024b05474eb6ad239602f4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Nov 7 05:15:05 2017 -0500

    Move API DTOs to API namespace.

[33mcommit d47cf601b79f3c8afe1d9b4ae89987b81b271657[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Nov 7 04:56:45 2017 -0500

    Introduce ModelRelief.Api.V1 namespace.
    Change Api area to ApiV1.

[33mcommit 82697d23a91020992d489f1dd467b93e54788212[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Nov 6 07:52:27 2017 -0500

    Update ToDo.

[33mcommit 8b1fcbe2adadb5d3de7400cc3ddb468aaa7af130[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Nov 6 06:25:45 2017 -0500

    Add Feature folders.

[33mcommit 774727fbf6dbcfd8be8d3517b521334e252cead9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Nov 6 05:36:20 2017 -0500

    ModelRelief.Models -> ModelRelief.Domain

[33mcommit 517462a48bf09804dad47b74c2582335b50f9ed3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Nov 3 11:26:39 2017 -0400

    Miscellaneous cleanup.

[33mcommit 700485c2411c1d7aa009235ecbadc0ce3921bca4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 29 10:42:47 2017 -0400

    Add integration unit tests which construct a server and HttpClient.

[33mcommit b8d553af6e8c632cfdf0fee246514bdcccd30e9b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 29 07:28:19 2017 -0400

    Correct user store path (extend with leading asterick).

[33mcommit 4e81b324a5174378ed7bc7ae7b42e5b1d21980af[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 29 07:24:00 2017 -0400

    Change user store path to use forward slashes.

[33mcommit 87cd556b8f8700818f0621dc881cad6820dbc991[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 29 07:17:29 2017 -0400

    Add user store to .gitignore.

[33mcommit 1f79b1429eeaa266f160ee80e60e6b997853f33b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 29 06:16:56 2017 -0400

    Remove user\store content from Git.

[33mcommit fdc10a00081dfcb7b770ab253ef8eb7a2e19c420[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 29 06:13:59 2017 -0400

    Add test constants that are not yet mocked to Settings.

[33mcommit b6ac9eb2a21f8dd67dcc570a33e409e482f04c20[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Oct 28 16:27:33 2017 -0400

    Introduct xUnit and Moq.
    Rename User to ApplicationUser.

[33mcommit 7f62a9474f540caa6fbd729134d0ceca1a9f038a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Oct 26 15:12:09 2017 -0400

    Add support for persisting DepthBuffers.

[33mcommit 1a386d1a4343cce212767d9f38bd43011c4a29b5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Oct 26 05:53:54 2017 -0400

    Add overrides to ErrorResult to allow specialized return values such as developerMessage.
    Add validation to FilePutCommandProcessor.
    Improve exception ErrorResult.

[33mcommit ae1f0f356519cec7ba6bea84b8a5eddb1d1a3d10[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Oct 25 06:01:54 2017 -0400

    MeshPutRequest -> MeshPutModel
    MeshPostRequest -> MeshPostModel

[33mcommit 7bc6bcc56d9f4f97a0007ba466a9ce81a13c7b03[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Oct 25 05:59:34 2017 -0400

    Add exception handling to FilePostCommandProcessor.
    Remove HttpContext parameter from methods with ApiController.

[33mcommit 71211d875d8dd07d56986a69c01bf5a8cd310612[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Oct 25 04:37:13 2017 -0400

    Refinements to IModelProvider.

[33mcommit 8e6c63f039896cc3eda851f143e82c57f979e690[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Oct 25 04:25:22 2017 -0400

    Add ResourcePaths.ModelFolders to define file folders for models.

[33mcommit ec0b8aff6dc9ea737d14be3a9416210dc741f637[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Oct 25 03:38:51 2017 -0400

    Refactoring : Resource -> Model
    ModelReliefEntity -> ModelReliefModel
    Models -> Model3ds
    IResourceProvider -> IModelProvider
    SqlResourcedProvider -> SqlModelsProvider
    TResource -> TModel
    TPutResource -> TPutModel
    resource -> model

[33mcommit e2bcd79042d5a4ac4f3c836b87ffed535aead0a4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Oct 24 05:57:21 2017 -0400

    Add interface for file resource with a Path property.
    Add Models MappingProfile to initialize AutoMapper.

[33mcommit 80c71989fedd3b14d1fe3e551700e96964567e48[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Oct 23 06:57:14 2017 -0400

    Introduce ApiController.
    Implemenation for FilePostCommandProcessor.

[33mcommit 02fd394569e92e679a93a51bce0ae937657eeca5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Oct 23 04:13:44 2017 -0400

    Frame FileCommand processors for PUT and POST.

[33mcommit aa05671636a5723bd38e22bce6c261d7a3c4c977[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 22 10:03:34 2017 -0400

    Expand MeshPutRequest validation to include check that the resource exists and is owned by the current user.

[33mcommit 8f56dca79df2c8eb36a5e017f2d4ac159ae35f92[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 22 08:52:16 2017 -0400

    Refactor validation to use the DTO Validate method which populates the ModelState error dictionary.
    A DTO ErrorResult methods composes the extended errorr JSON result.

[33mcommit fdce5dd3087835a0312336bf44ad4e97cb0c13dd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Oct 21 12:01:17 2017 -0400

    Add RawRequestBodyFormatter for handling application/octet-stream.
    Add MeshPostRequest class to represent file stream.

[33mcommit 194adc5326d00a0f75f75838827aa8bd7d8eafe8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Oct 21 08:53:51 2017 -0400

    Identity.GetCurrentAsync: add conditional block to look up User by Id to allow Postman testing.

[33mcommit f01013ec8fd63a9c2348cd4b51987f40a82c2189[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Oct 21 07:31:16 2017 -0400

    Force route names to lowercase.
    Introduce RouteName class with route name definitions.

[33mcommit dd7cb91e45e81058a7e76c88c10e32503242fa50[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Oct 20 18:43:08 2017 -0400

    Add support for ValidateMeshPutModel attribute.

[33mcommit 4251afac27b3b6425e0e807cc615b3ac9e8acebe[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Oct 20 16:21:31 2017 -0400

    Add global ValidatorActionFilter.

[33mcommit 006a98729be6e62ce92e253a9654b4f3338921f8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Oct 20 08:12:15 2017 -0400

    Experiments with MeshPostRequest as IIValidator.

[33mcommit a2dff7853d3ad8a272d0a317990a9ddf71fcdee5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Oct 19 15:51:19 2017 -0400

    Refactor Meshes API POST to clarify temporary and final mesh file names.

[33mcommit 61ea8fbfbd1c6f558fe2aeefd8adf0ea660d4200[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 15 15:52:08 2017 -0400

    Return absolute Uri in Mesh POST response.

[33mcommit 80d13aee776d57bc675234340d483207417b90b5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 15 08:15:53 2017 -0400

    Refinements to Mesh POST.

[33mcommit 19d060cea71011f539336df94b7b74a78a17d617[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 15 06:20:03 2017 -0400

    Update ToDo.txt.

[33mcommit 9cc34e27a2e8f50c6149e043f8696df8564581f9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 15 06:15:36 2017 -0400

            Refactor FileSave to use async/await.
            Return Created status from Mesh Post.

[33mcommit ff087b56e226157a4850e952bcbb2572bf1cb804[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Oct 13 16:04:05 2017 -0400

    Complete DbInitializer.

[33mcommit 7e09a9c645bfd3e8fbe56a1ee22436296499bbae[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Oct 13 12:18:12 2017 -0400

    Initial implementatoin of DbInitializer.

[33mcommit 42d989ab1cb69636010f1bc3fe858388f216f08e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 8 13:07:44 2017 -0400

    Change namespace ModelRelief.Entities to ModelRelief.Models.

[33mcommit 4c37d56ce26b5a6121c8b6822db7beb887c8e897[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 8 07:29:53 2017 -0400

    Add support for Mesh POST.

[33mcommit 02c95b7f69fb0639ee0071160838a3d34a51b81e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Oct 7 09:54:51 2017 -0400

    Add AutoMapper.

[33mcommit abe454f7e16dcda6d6657ab73951b598cfe42fe3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Oct 6 12:00:27 2017 -0400

    Complete SQLite migration.

[33mcommit 3fec2b120fc171774875629d7fa1eda9907c18ab[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Oct 6 05:13:18 2017 -0400

    SQLite conversion.

[33mcommit 8d791729190e037c6e51d9b435486c6a830b9ca2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 1 11:34:55 2017 -0400

    Add Project tables to datrabase.

[33mcommit 2d9326b56711bc506d40535f13bc5d6da0423b9f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 1 11:27:04 2017 -0400

    ProjectTables migration.

[33mcommit 0cf5c11b6e7e1ab1fbe2b1d6bda69e1acb700674[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 1 11:23:01 2017 -0400

    Extend database tables to support Projects.

[33mcommit 0d4f0a51a1c8e9431685e0ff175947bbfab01baf[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Oct 1 07:59:28 2017 -0400

    Add ModelReliefEntity base class.
    Resolve typo in ModelRelief.Entities.

[33mcommit 77159edf61cd8f70a29d039f9ffadb2e36e38209[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 29 14:58:31 2017 -0400

    Initial Autofac integration and tests.

[33mcommit 4e99a6ee8731109b02ef5b798fcbf122e9e13a9a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 29 07:58:03 2017 -0400

    Make depthbuffers spinal case (depth-buffers).

[33mcommit e31175c0f98766cc4788156fc55bded0abdc27a6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 28 15:33:50 2017 -0400

    Refine configuration for Serilog logging.

[33mcommit 5f2ec7709d705326255955d15482ad144e0cc2f4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 28 10:19:38 2017 -0400

    Add file logging.

[33mcommit 933dd1eec1cfee4828aee32619885c5ae48a53ed[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 28 09:39:35 2017 -0400

    Initial implementation of logging using Serilog.

[33mcommit fe423db54d523826c616b3cce54d679438ffcb92[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Sep 27 05:35:55 2017 -0400

    Upgrade to ASP.NET Core 2.0.

[33mcommit 61cfe3fb7c8dcd102055fc2e616474cc0fef8289[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Sep 27 04:06:30 2017 -0400

    Add global.json to set ASPNET Core version.

[33mcommit ecb1d7ada80152844fd3779eab604411ea48aa3c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 24 20:06:56 2017 -0400

    Update ToDo.

[33mcommit ea3f87e15b2a374b4f63566299fa8ad217eba276[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 22 13:37:59 2017 -0400

    Introduce POST (application/octet-stream) and POST (application/json).

[33mcommit 2aa415bccb2327bee3c7bd9e22c76486e0f528d7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 22 07:20:37 2017 -0400

    Implement SqlResourcePovider to support database tables with a primary key.

[33mcommit d44479f617b32bdfd37d77e07ee27ea17d24dd45[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 21 17:07:06 2017 -0400

    Add Model3d Put and Delete support.

[33mcommit 63e366e42a9f2df77bce9c7bb9fa58728352c77d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 21 15:42:11 2017 -0400

    Add Api controllers.

[33mcommit dfdb2993fea2724a56e50cffe3bb1928f9d45d10[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Sep 20 07:26:34 2017 -0400

    Frame API controllers for Mesh and DepthBuffer.

[33mcommit c08a2cc439c8adcd60df642b57015bffeea9314f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Sep 20 04:52:33 2017 -0400

    Deprecate FileSystemResourceProvider.
    The database schema will include file paths.

[33mcommit e2fe45497cfed8cad9e364efdfce3fd3763ad9bb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Sep 18 07:37:55 2017 -0400

    Add DefaultFolder support to FileSystemResourceProvider.

[33mcommit 1a0fb1179703f45ec9150ea8cccc31e4a2ad3799[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Sep 18 04:16:58 2017 -0400

    Rename file Locator suffix to Provider.

[33mcommit 7e06ff34aaa2be7456708cb000c682cb51bc7308[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 17 15:10:55 2017 -0400

    Change resource id to string so it can be used with the FileSystemResourcesLocater.
    Locator -> Provider

[33mcommit ee93c3f9e620216b7f50246aa51d4ad17568712d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 17 10:40:56 2017 -0400

    Introduce user folders for owned resources.
    Add IResourceLocator.

[33mcommit 09f54acf89c54e2541c513866237512a4639f4f5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 17 06:33:04 2017 -0400

    Add Identity utility class.

[33mcommit 12074652b01ba5dd134e8eb2ee01ea1697f88d7e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 16 16:37:19 2017 -0400

    Frame MeshesController, DepthBuffersController.

[33mcommit 980c65693dc9bf680d87a830702b82dc65726628[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 15 15:44:51 2017 -0400

    Add CameraSettings, ReliefGenerationRequestHeader.

[33mcommit 0414bbce1ecb13c067b4a0b50d1ac4ac29bbffb2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Sep 12 07:54:35 2017 -0400

    Add ReliefSettings interface.

[33mcommit 9d24a083cd7df12d37b4af86eb2db8efa4dd9493[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Sep 12 06:51:40 2017 -0400

    Add Http class to support XmlHttpRequest operations.

[33mcommit bb464702741d305e30d8ad0e93bb08947dd6d1f9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Sep 12 04:22:54 2017 -0400

    Style the UI settings.

[33mcommit ec4551c5367ee5cbd36094d1c409cae933427f93[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Sep 11 05:59:58 2017 -0400

    Add Composer relief processing UI options.

[33mcommit f11be63613b71c360bd0c14a7ee0fa8a32542686[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Sep 11 04:42:31 2017 -0400

    Update ToDo.

[33mcommit 95b4c9c9347d20aeeb94c82ead9d807c60525fb6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 10 15:59:19 2017 -0400

    Update ToDo.

[33mcommit 2a7cdfcd1f1670425c4b1df299143d81db9c99bc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 10 13:25:07 2017 -0400

    Post DepthBuffer.

[33mcommit fd430b2205fb5e527c932d726619ed319fe87540[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 10 13:00:21 2017 -0400

    Complete initial MVC refactoring.

[33mcommit 212d95db3e6d0ad4d9541bee23df4d1d1ed43435[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 10 11:59:39 2017 -0400

    Add ModelView and MeshView.
    ComposerView constructs a ModelView and MeshView.

[33mcommit 34e296e0a9d9f8539de32d8fa062a345d09feefe[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 10 11:45:03 2017 -0400

    Add Viewer, Graphics folders.
    Refactor ModelReliefView to ComposerView.

[33mcommit a7373aac51f52ec88e0199a8377e7e698713ed85[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 10 11:14:21 2017 -0400

    Create ModelReliefViewControls.
    Move mesh generation and save relief from ModelViewer and MeshViewer.

[33mcommit 37db217d3ddf490969912f5cc1e67d69abfd0f08[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 10 06:22:08 2017 -0400

    Add ModelReliefController.

[33mcommit f218169ebb89a4dc369b27be7fc7d8ab0bad130e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 9 19:06:49 2017 -0400

    Add ImageSharp reference.

[33mcommit 2a1b7e8e433790c47e0046e4cf0940e9f1d1dd03[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 9 16:36:17 2017 -0400

    Change MeshViewer material.

[33mcommit eb09d089b83f2b5911faa0356a1e519c6b56e1eb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 9 16:22:17 2017 -0400

    Add TypeScript build task.

[33mcommit ec3b0ed9e1e2b5df0ee1528dc633e9d25a4e26f5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 9 15:10:43 2017 -0400

    Add Server namespace and Files class.
    Add copyright messages.

[33mcommit 7962a1b36a08cf83b2e005be97b61dbfd64a6e61[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 9 11:41:40 2017 -0400

    Annotate debugger options.

[33mcommit 0f003451f3437c97affaa90ec46e8ffa725b8610[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 9 08:17:17 2017 -0400

    Annotate VS launchsettings.json.

[33mcommit 33c97d95331c0243d1037aa748676fcc19595d8e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 16:26:21 2017 -0400

    Models Save action returns void (no View).
    Save overwrites an existing file.

[33mcommit 510e279b0fadf79c627f10637623f81cefce1abf[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 16:06:57 2017 -0400

    Compute vertex normals during mesh construction to improve smotthing!

[33mcommit e4af1da62442db500101b7cd8b2d559aa1f6de72[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 15:01:52 2017 -0400

    Complete basic support for save in ModelsController.

[33mcommit 057f170872e85111fad1cd1c6b3caa51508bca10[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 12:25:47 2017 -0400

    Add MeshViewerControls with Save Relief option.

[33mcommit 1f7537e4215ed2cd68f79b22937730632ed15e2a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 09:29:30 2017 -0400

    Add OBJExporter class.

[33mcommit 0a39576f50ebe88404bcfbeb99a4559e6e4e0b24[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 08:58:27 2017 -0400

    Resolve check for default clippng planes in mesh generation.

[33mcommit a2a9231234d5c307ba66eb541875cfb5f67ba8d9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 07:04:53 2017 -0400

    Force clipping bounds when generating a mesh if camera planes are at default values.
    The resulting mesh extents (calculated at the near plane) were too small leading to resolution issues.

[33mcommit 4e30d83bf85cd550c1e4110392ea0c8ae13c3897[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 06:14:31 2017 -0400

    Set mesh Geometry update flags!

[33mcommit 71192d8e3ad2a37443681d313ea2431dde718898[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 8 05:25:39 2017 -0400

    Clone mesh in DepthBuffer.constructMeshFromTemplate.

[33mcommit 573a80fe9797938f2ae498a608104690f56ce180[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 7 15:34:59 2017 -0400

    MeshCache: Use compound key based on both the near plane and the pixel extents.

[33mcommit 78071817df916fa3f6a8b6e4e9bf82db44766a4a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 7 15:14:01 2017 -0400

    Add error beep on failed TypeScript compilation.

[33mcommit 3ad7d33a3e28608f7f5fb98304cc561cc5fe0edf[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 7 10:35:00 2017 -0400

    Add MeshCache class helper to DepthBuffer.
    Merge mesh vertices after creation.

[33mcommit 141e36f92e94331dde58d540f320bbb18309c196[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Sep 7 06:49:58 2017 -0400

    BoundClippingPlanes control updates camera now.
    Add source code attributions to THREE.js.

[33mcommit a647b84987caa2b01e2d78981d2a3c4bee818f9f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Sep 6 07:37:26 2017 -0400

    Add Python launch configuration.
    Add ESLint.

[33mcommit 9fbc63b50a3e54bd2c27dcdd74b3f692e0dffc8e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Sep 4 06:47:25 2017 -0400

    CameraControls: Add Bound Clipping Planes button.

[33mcommit 686280a132c7274920f3d76ea46631c006dabbd8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Sep 4 04:41:50 2017 -0400

    Add Graphics.removeAllByName.
    Remove resources with Graphics.disposeResources.

[33mcommit d4c3b80b12d6949aa4022461e09288089e0c6d0c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 3 09:48:34 2017 -0400

    Extend CameraHelper to create second helper in View coordinates.

[33mcommit d9b5ecb35a5351b7907693852625ebaa406ebe26[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 3 08:58:29 2017 -0400

    Optimization with Graphics.getTransformedBoundingBox.

[33mcommit 320bea3874826f5bea2b440bef3af1952457a3dc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Sep 3 05:46:25 2017 -0400

    Extend StopWatch to show nested events.

[33mcommit 7110c29af1173c577f4da61d1acb3881529d0554[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 2 19:37:07 2017 -0400

    Update Todo.

[33mcommit f42820fd2ff349266be6131375d4c77da7af0f3d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 2 19:14:48 2017 -0400

    Create a utility StopWatch class.

[33mcommit 31c11d90fbf8c5f5ecb5224b731ef762cd796ee9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 2 17:01:36 2017 -0400

    CameraHelper: Add target line.

[33mcommit bd592d33c33942121bbfc7394d42f1c6fa6f2033[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 2 16:41:42 2017 -0400

    Camera target is always BoundingBox center.

[33mcommit 1cdc863d13521bbce39cde1ecda1612199e3aa2f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Sep 2 10:54:07 2017 -0400

    Frame CameraHelper.

[33mcommit a6ec4675cf40ff762a46a7bf5aead7d734bcb318[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 1 18:35:14 2017 -0400

    Preserve camera View XY during Fit View.
    Resolved "drift" during successive Fit Views.

[33mcommit 9a13a8a5aaa5315cbf7b4f5b87881e04dbae883c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 1 18:19:37 2017 -0400

    MeshViewer default orientation is Top.

[33mcommit b9edba9d909905cc883937f77bb50a97486c8c9d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 1 16:07:54 2017 -0400

    Fit Meshviewer after mesh generation.

[33mcommit 06f428d2ab1dcc41ede1c1fcfded7382e0feb40a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 1 15:53:21 2017 -0400

    Camera matrix is updated only in render loop!
    Force camera matrixWorld to be updated when constructing StandardViews.

[33mcommit 81a83b346bf674e9f3ec7d6e344a8b4e2b5a01ff[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 1 10:36:00 2017 -0400

    Replace CameraSettings with Camera.
    The CameraSettings do not contain all information about the camera (e.g. rotation);

[33mcommit fb5fa1a9783409cd33138a9c7ee971d915e4c1a2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Sep 1 08:53:35 2017 -0400

    Partial implementation of StandardViews

[33mcommit 18e14c96498c1548dd1070cc0b035b47e96baa28[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 31 05:55:57 2017 -0400

    Extensions to Camera for StandardViews.

[33mcommit c5dc486082231813c7793eeea22151ae0eb3bad1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 30 06:53:14 2017 -0400

    Refactor ModelViewerControls.

[33mcommit 4e3c13339c190434299b9047d682dcecc2e9caf2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 30 06:02:12 2017 -0400

    Add CameraControls class.

[33mcommit d734dbfe0f7f9a8a3689030f28ea193160fac569[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 29 07:24:06 2017 -0400

    Add StandardView UI settings.

[33mcommit 596359ccc590e08c1b96a53f9bebfee5ac4a92d9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 29 04:55:37 2017 -0400

    Rename MeshPreviewViewer to MeshViewer.

[33mcommit b376570abbffacfe0f061e2556c3c85e67c25c15[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Aug 28 05:15:31 2017 -0400

    Use spread operator in EventManager.dispatchEvent.

[33mcommit 2d45114ca552e54544fbf9886e10699ff37b0a73[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 27 19:06:53 2017 -0400

    Add Listener type in EventManager.

[33mcommit a0f2c1a808c2b375671cf7a089e6375eafa02b36[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 27 18:14:20 2017 -0400

    Add EventManager class.

[33mcommit 8e1be3b4ce67b182f43ed186db00d6bc7e63dc90[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 27 15:25:24 2017 -0400

    Styling changes. Remove diagnostics.

[33mcommit 9af36d4321218fbb838bc25dcacb21e5f066affe[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 26 20:18:46 2017 -0400

    Convert Viewer model property to setModel method.
    super.model can not access property of base class.

[33mcommit 2a5a56890f79a568c39f7f8534c638e64d8da033[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 26 16:12:18 2017 -0400

    ModelViewer: call super in initialize.

[33mcommit 49761c5e29135fa79f3f6b987c074cf8cbee05b1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 26 15:41:19 2017 -0400

    Add synchronizeCameraSettings.

[33mcommit 1c85ac47da5f9e711cb2a2ee4c2e093625b13a51[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 26 15:31:21 2017 -0400

    Add ModelViewerControls class.
    ModelViewerSettings hold the UI settings for ModelViewer.

[33mcommit 465d86eeb28f6a88a666b37a89b5422c280200e2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 26 14:07:13 2017 -0400

    DepthBuffer always generates mesh in pixel units.
    Later, there will be support for scaling the final mesh to model units.

[33mcommit 1dd23c32d6fc7b36c69d25c38c35406c08452565[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 26 13:55:54 2017 -0400

        Viewer: Set StandardView on model property assignment.
        MeshPreviewViewer: Add a square placeholder mesh in the constructor.

[33mcommit 4a6af9dfbde356592c01c0ca81cbd284baad1efe[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 26 13:22:39 2017 -0400

    Introduce TestModelLoader class.

[33mcommit f4bcf791d1778076b50a9c260852753625fad55d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 25 13:39:44 2017 -0400

    Add gulp watch for CSS files.
    Override Bootstrap background color.

[33mcommit b860c64aec047292e9ee6fa27c947e07bebf6da4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 25 13:13:48 2017 -0400

    Re-enable ViewerControls.

[33mcommit 4286bd0f19b9a35f5e46759426f74b011fbf65f0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 25 13:00:13 2017 -0400

    Add support for Front default camera view.

[33mcommit 1bf2e5de3d640e091a0fd4390f582b1860576abe[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 24 16:19:51 2017 -0400

    Adjust near plane to avoid clipping geometry on boudary.
    DepthBufferFactory.NearPlaneEpsilon specifies the relative offset.

[33mcommit 3a9be8425e10295d71453751a9be856b17867b04[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 24 15:50:39 2017 -0400

    Add camera near and far plane controls.

[33mcommit 924136dcda7e68277e3cbb9eae39d94c56ad9ef8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 24 09:02:00 2017 -0400

    Scale mesh base to near plane.

[33mcommit 2fb75f4822ae146ba4c959a3c85078b3bad6cb9f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 23 07:36:44 2017 -0400

    Add SlopedPlane tests mode.

[33mcommit 53053f5f0c466f539b8a20195ccb72b523810ac3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 23 04:52:56 2017 -0400

    Optimize mesh creation.

[33mcommit fcd47358ebaf46e84d03c82ce296d5fe8e4398b3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 23 04:26:28 2017 -0400

    Experiment with moving model depth to shader.

[33mcommit 6ff57b47ae3bc68e59eb8df8c757eaf0e7061177[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 22 07:18:36 2017 -0400

    Depth calculation relative to mesh plane.

[33mcommit 212e744aacd77ac1f6d0035377b1963bf09fa52e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 22 05:47:32 2017 -0400

    Add depth proble to DepthBufferFactory.
    
    Switch to VSCode.

[33mcommit 443b77081643272e4e3af50a99a35a92b7f97970[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 20 08:00:33 2017 -0400

    Complete browser-sync implementation.
    
    Add gulp-sourcemaps.

[33mcommit aa5af7d0e4832153e1b3b860403afd2c799edc87[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 20 07:32:22 2017 -0400

    Orphans

[33mcommit e2ce2ab4c3c8ab6451f849c6e64f63773ab1201b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 20 07:32:06 2017 -0400

    Add run-sequence for task staging.

[33mcommit c35588b85dae8b90b77079dbe6e707cc00078568[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 20 05:53:28 2017 -0400

    Add browser-sync in gulp tasks.

[33mcommit 5413c474570e26264bfab1721d0328f69f26c21e[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 19 18:47:26 2017 -0400

    Orphan

[33mcommit ab9fb229d4f83458b36a8f0c1dcdf1b04191a2f6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 19 18:47:17 2017 -0400

    Add TypeScript compilation to gulpfile.

[33mcommit 6243238aa419b1db9b2d990f46f446fb63726a76[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 19 10:04:13 2017 -0400

    Modify  checkerboard color to gradient.

[33mcommit 89c90e8290125304b81bf79b89e3b9fbd46543f7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 19 09:18:49 2017 -0400

    Add checkerboard test model.

[33mcommit aeb0f7e0db6733c2bc9f0562e9f7f385cef9220b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 18 18:35:59 2017 -0400

    Orphans.

[33mcommit 74c6f1dde734a53e77e23b3b7eb1681b59283a87[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 18 18:35:31 2017 -0400

    Return raw WebGL depth buffer.

[33mcommit 6e8607eb3fcec28b3d0d76626aa07da6950f2bb2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 18 14:24:14 2017 -0400

    Orphans

[33mcommit 86cceb6c2cb695e7876986141628e6e3a8b16aa0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 18 14:24:02 2017 -0400

    Dynamically set camera clipping planes.
    
    Before a depth buffer is created, the extents of the model in View
    coordinates are used to set the camera clipping planes

[33mcommit 7c9aa948dc44246712a5e607292a7604b3c17249[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 18 10:15:58 2017 -0400

    CameraTest: implement setClippingPlanes.

[33mcommit 2d7a87bcc5f780b3ca648d47418bb65a3c20c357[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 18 09:03:26 2017 -0400

    CameraTest: complete BoundingBox transforrms.

[33mcommit 8e66500e166ca84e0214adfbacfd146ae0047859[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 17 11:23:28 2017 -0400

    CameraTest : Zero rotation BoundingBox correct.

[33mcommit 4749b2e754d4e6d0eb23f97b2056cebdc1296d1a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 17 07:30:35 2017 -0400

    Graphics create methods now take Material.

[33mcommit 8013cde8484551c49efff11948666ff7062b417a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 17 04:45:13 2017 -0400

    CameraTest: use Box not Mesh.

[33mcommit a4951624bedfcbcd560277667198e6062ce68171[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 16 07:34:51 2017 -0400

    CameraTest: Add bounding box to scene.

[33mcommit 0abf5ac1e31bfd81143f88f5ef45b11928ef72bb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 15 05:09:46 2017 -0400

    Add camera contrrols to CameraTest.

[33mcommit 71fd9a6f6f80ed7b1c24dbe75a409a267770672b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Aug 14 07:26:58 2017 -0400

    Add CameraTest.

[33mcommit 6a1c584c3ce4399addc4ef81a7723cda409d3e8b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 13 10:23:11 2017 -0400

    Subclass ModelViewer and MeshPreviewViewer.

[33mcommit 38d14cba6a824326502afa75d10285824b12811f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 13 08:32:45 2017 -0400

    Rename Viewer ModelViewer.

[33mcommit 01c62a9a15f1e969e7a902e5dd07bc9534ec6922[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 13 08:21:12 2017 -0400

    Rename Viewer onResizeWindow.

[33mcommit 0e4ba5ecd61edff41db5608426777680d3a8d90a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 13 07:06:35 2017 -0400

    Add Inheritance Workbench example.

[33mcommit fa3d4b7af77b620d4d74876402d116cd7b4a1917[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 14:47:26 2017 -0400

    Refactor DepthBufferFactory.

[33mcommit 0c323d084a27a27cce85fdbf2b4a768e4ed02204[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 13:02:59 2017 -0400

    Add camera property to Viewer.

[33mcommit 8888ae6336cdf300d60ce1ab7983ae3c28bcbbe2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 12:45:45 2017 -0400

    Refactor MeshPreviewViewer.

[33mcommit 3bbe07ac9098907a37a740627abb33de02ccc7d3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 12:04:06 2017 -0400

    Refactor Viewer class.

[33mcommit 2581a435764c80e4af75ee2ebf154b40ef114c49[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 10:43:15 2017 -0400

    Remove DepthBufferTest implementation.

[33mcommit 91cd46f26de08346fa175ff27390cb3e78713792[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 10:36:27 2017 -0400

    Add Loader class with test models.

[33mcommit d4cc89f51c90c08d1d69b33272eb6db02dc3c175[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 09:44:53 2017 -0400

    Refactor Viewers.

[33mcommit 441af87815542463998b6c7be30a2f39a7b400a2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 12 07:02:12 2017 -0400

    Viewer refactoring.

[33mcommit e0fc9c617358a09157774affa2ec0b79f7785fa8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 11 17:06:17 2017 -0400

    Add MeshPreviewViewer to Viewer page.

[33mcommit 1546e556dc502ee84bfc96890d39ac97f48bd1bd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 11 15:50:01 2017 -0400

    Refactore MeshPreviewViewer class.

[33mcommit fcd0f2a1db176f082b956af6535ef199360c7b09[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 11 14:52:12 2017 -0400

    Add Services class.
    
    Share logging services.

[33mcommit 6245ac64ac66db86dc557ae1b007584abd36dc79[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 11 13:58:40 2017 -0400

    Orphan.

[33mcommit 16768cc7bcfb88d040df13202fdfe99a2c4b4027[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 11 13:58:31 2017 -0400

    Add MeshPreviewViewer class.

[33mcommit 8b281c07e4543ef817caa7287a7be92b920fbb5b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 11 10:16:10 2017 -0400

    DepthBufferFactory is working.

[33mcommit af43220b79110a188ee95830f440bc0545376c05[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 10 16:46:31 2017 -0400

    Initial layout of DepthBufferFactory.

[33mcommit 01688e4e03d569269233eb4f618fa644f0a06d27[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 8 07:46:43 2017 -0400

    Remove PostCanvas; Increase resolution to 768.

[33mcommit 5e753e0e7068630c4094f31fff623dca25c20803[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 8 07:28:23 2017 -0400

    Add Camera button.

[33mcommit 1f9751d19cf6abef554f9ebab605379aa31574dc[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 8 07:13:29 2017 -0400

    DepthBuffer.mesh offf by one error (columns).

[33mcommit c54739f1b0a86c9385257eb3be2c2e92b3eaab78[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 8 06:05:01 2017 -0400

    Orphan

[33mcommit 38a97cbff719e0473fee1c899ea2e1aef0543686[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 8 06:04:47 2017 -0400

    Construct MeshGeometry from DepthBuffer explicitly.

[33mcommit 3ce3d68c22875dffd7038d496c3465adec75351a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 6 16:45:51 2017 -0400

    Use default material in DepthBuffer.mesh.

[33mcommit 55de6b6d091689b301e7e16816b622700ebfb53c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 6 15:45:40 2017 -0400

    Add UnitTests module.

[33mcommit c9504df23192995a42d6c98074a432f453607231[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 6 09:40:55 2017 -0400

    Add chai assertion library.

[33mcommit 54d5265c4850a6b4356c9db6454657610ac3918c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Aug 6 08:47:47 2017 -0400

    Refactor DepthBuffer.

[33mcommit ef78fb5b8fa3164c4c1b31d4ec4335a5dd423cdb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 16:57:55 2017 -0400

    DepthBuffer.getVertexIndex does not use view!

[33mcommit 31aa703cca5d9969798bb411d94c5056593fe4e6[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 16:20:50 2017 -0400

    First pass at DepthBuffer.getModelVertexIndex.

[33mcommit 7da0c17b3e78efd60dff6f374b78d8831760bc33[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 14:58:39 2017 -0400

    Frame support for transforming model mesh.

[33mcommit ac477cc44e686f66ba2f3132f42e1773064c834d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 13:13:15 2017 -0400

    Extend Mesh shaders to translate vertex positions.

[33mcommit 7e808544696c528d43883207ef50e12a3dd77718[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 12:07:33 2017 -0400

    Orphan.

[33mcommit 7e36367e37d0be3b5eb9216decd43b27555b1176[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 12:07:24 2017 -0400

    Set Mesh resolution equal to depth buffer.

[33mcommit d8bbe4ddf92e0b83ef8939456875e99c8cce454d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 11:25:54 2017 -0400

    Add Camera Properties to diagnostics.

[33mcommit 31067e47c380e3e9034a29f9950450370b4fd3ad[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 10:48:35 2017 -0400

    Add support for CSS style in HTMLogger.

[33mcommit 267e8fbf0889a2bed821133dc952c6e94e7b6162[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 07:25:19 2017 -0400

    Use torus in DepthBuffer test scene.

[33mcommit 740d2185eced40e6161892d37e5f5d98089c2903[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 07:04:20 2017 -0400

    Add comments.

[33mcommit 237ff47bef72143d8b6483bca0ffc34e81c47d01[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 06:22:49 2017 -0400

    Add gulp 'serve' task to watch/build shaders.

[33mcommit 4c802f510ee29f4124b4633e0b2112ddd2bb7424[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 06:16:55 2017 -0400

    Share Log instance.

[33mcommit 866e3307527764082b1cb63cacf03da0c9436d27[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Aug 5 05:39:51 2017 -0400

    Refactoring of DepthBufferTest.

[33mcommit 2a0841d372fddfea28ea3e69f437ebfe1873f106[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 4 14:06:45 2017 -0400

    meshCanvas displays encoded RGBA texture.

[33mcommit 9caa7b7a0c13e90f0ba5ac2f9ac6bebaa77fdb52[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 4 13:32:12 2017 -0400

    meshCanvas displays target texture.

[33mcommit 4086c573e2a9eff40cd0c7f58f39ebb4297047e8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 4 09:46:59 2017 -0400

    Baseline Mesh scene.

[33mcommit e0678e5d08b4761ef787f7e7a7857d8719392761[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 4 09:04:22 2017 -0400

    Or[hans

[33mcommit d2a82f9a8147bae44d2588234577d0351d63bec5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Aug 4 09:04:11 2017 -0400

    Framing for MeshRenderer.

[33mcommit 83f29d534380b260a8959cb5d7c3eee5834472cb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 3 10:56:28 2017 -0400

    Add Box test model.

[33mcommit 80e54a43a79c25d1ebc3b1d09a5d40920144ec1c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 3 10:31:03 2017 -0400

    Add DepthBuffer class.

[33mcommit 20abacffce46e3e000ebab9a2b5992fc42ac7123[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 3 08:29:30 2017 -0400

    Add color support for HTMLLogger messages.

[33mcommit acf84ae7ec23e74ab0f8bbb584499987d49050b1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Aug 3 08:11:54 2017 -0400

    Add Log class for diagnostics.

[33mcommit e792bc8da3b8667b014b5092902fff3bcddebf3f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 2 17:23:00 2017 -0400

    Miscellaneous DepthBuffer experiments.

[33mcommit d0efc2ca8a3cb2e4f70d420676704c87eb23151d[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 2 16:25:54 2017 -0400

    Add diagnostic output to createDepthBuffer.

[33mcommit 4c557d61f18fbd59ad984e998547cde136bd789a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 2 15:37:49 2017 -0400

    DepthBuffer: cleanup

[33mcommit 039dc9e982d267c1a9b60ff08e2d260c5b0903c0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 2 15:15:32 2017 -0400

    Workbench :depth encoding in render target

[33mcommit 14b258aa51cee8ab80ace15834efd853531c1f67[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Aug 2 06:39:41 2017 -0400

    Experiments with readRenderTargetPixels

[33mcommit e52c40aa4343dffa9034204385ebe621c49c1390[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 1 09:21:19 2017 -0400

    Dynamically size canvas views.

[33mcommit ac1c7ebf97fe0251a045391ed8b208b02031c0ea[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Aug 1 07:18:54 2017 -0400

    Refactor DepthTexture to DepthBuffer.

[33mcommit 883e41d066628dac5897332d890abd13e4e44ad2[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 31 16:54:51 2017 -0400

    Add support for saving PNG DepthTexture.

[33mcommit 95bb5b6bc49c7aa4eb66c65c9d62f2e6d1ffc861[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 31 06:40:53 2017 -0400

    DepthBuffer: add img ellement to layout.

[33mcommit c4932e3a69927786bde0b915e87550b941f2bbc5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 30 18:35:38 2017 -0400

    Create DepthMao in separate canvas.

[33mcommit 29fc6cba6a8defa7fda9c93d6e09d8974d7cbe63[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 30 16:34:11 2017 -0400

    Experiments with DepthTexture.

[33mcommit 987d0deb40ac36f21143168f704e3b6b549675bd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 30 15:07:47 2017 -0400

    Document Graphics, Math and Materials.

[33mcommit 0ba57fa0ac0d75a555f2c4df2ebec82190e150cd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 30 11:31:58 2017 -0400

    Add Workbench controller.

[33mcommit 8017ee5961ac71f4287f8ff56c7f48f7b8725e52[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 30 09:34:23 2017 -0400

    Add DepthBuffer example.

[33mcommit a04aa27325646615566b869d664d381f510fedaa[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 29 18:00:09 2017 -0400

    Add Math, Graphics and Materials classes.

[33mcommit 31d9d839178c0bb83454f11e9504c8a167bcc21b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 29 11:25:36 2017 -0400

    Add gulp shader generation.

[33mcommit 963fbd6d7d0f1675c9c6b7cf06b15e5797ab71a1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 28 11:11:07 2017 -0400

    Toggle material color on DepthBuffer change.

[33mcommit 59eb12a3ba355429ba1a6a81bb4d347c146116eb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 28 09:59:19 2017 -0400

    Add DepthBuffer control.

[33mcommit dde4e4dfe80d1846814315e57605cd11465d58c3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 28 09:38:00 2017 -0400

    Add support for Display Grid.

[33mcommit 78998672512119ff262594a3689e8dbf565d8833[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 18:01:59 2017 -0400

    Experiments with JSDoc

[33mcommit 10967c935ca2610d89d68a2642fc40accc8dbf89[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 15:26:22 2017 -0400

    Add JSDoc

[33mcommit cd1e98deb26f3d25078f5a96a03fa94aa2268e00[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 14:33:30 2017 -0400

    Orphans

[33mcommit 6986a7f18f616452ffa10a93868b5d49ffd9f479[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 14:33:12 2017 -0400

    Add JSDoc comments

[33mcommit 639f4d53d2930ea6fdee28ba42a4e2be06ca7739[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 12:52:04 2017 -0400

    Introduce Scripts folders.

[33mcommit d7dd2d890052dcd225182192dea97381c8edfd24[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 12:40:59 2017 -0400

    Module implementation complete.

[33mcommit e1d112ff1b2958161710b7c75d3268041879dae0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 10:36:05 2017 -0400

    Trackball moved out of THREE.

[33mcommit 5e10dbf12ed83357ba395a860bbe227e6c36ca90[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 07:24:59 2017 -0400

    Orphans

[33mcommit 0b4b4c385e30829bad7122ea8f990251d2b2c0f5[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 27 07:24:47 2017 -0400

    THREE.TrackballControls unresolved

[33mcommit 3cae4c4841924a86c84d69810cb1cab105892ff3[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 23 11:23:12 2017 -0400

    Refator Viewer : promote anonymous methods.

[33mcommit aa3652742661ed7f9386abb736b69f9bb746e540[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 23 10:59:46 2017 -0400

    Add OBJLoader class.

[33mcommit 7405f1e9b53e90e95f406520c73c08de15c949eb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 23 10:25:58 2017 -0400

    Refactor Viewer class.

[33mcommit 6f6ba250965595751657eb6f272391d95d710b41[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 23 05:08:18 2017 -0400

    Refactore (app->main, OBJViewer->Viewer)

[33mcommit b6224a45a249b9cef702086d4de95256f39aaffe[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 23 03:49:55 2017 -0400

    Update ToDo and tsconfig.

[33mcommit cdaf5e16754a039f538c2ab681c2761545ba3278[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 21 17:04:45 2017 -0400

    Update ToDo.

[33mcommit 9da46151b87b6af0b10d72505c55433e10ab30a8[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 21 16:35:15 2017 -0400

    Complete version to MR namespace.

[33mcommit 27ceb88ed038003d4228dc849196788ddab7f9ac[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 21 15:26:47 2017 -0400

    Revert to MR namespace.

[33mcommit 2fb876d2b85df535f6e13d726c2447624abd4583[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 21 04:09:47 2017 -0400

    WIP: partial implementation of modules.

[33mcommit 33da5115e8e2c37e5b61b45db69cf8a20f0a33a1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 19 05:05:10 2017 -0400

    Add hidden folder to .gitignore.

[33mcommit 25109e400f389d14c3858098fcf95a29897612ce[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 19 04:43:07 2017 -0400

    Update  ToDo.

[33mcommit c2b3b110513210dbb51d3e87ae9ff0798b35d8a1[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 17 07:21:35 2017 -0400

    Extend gulp CopyNPM task to include threejs.,

[33mcommit e5765c500dd1188f032d26e8b0d0d7a32e1a1341[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 16 17:32:44 2017 -0400

    Add gulp CopyNPM  task.

[33mcommit 04bece30b1ab1ff784916b843b94b9f79da5088a[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 16 09:22:40 2017 -0400

    Add jquery validation.

[33mcommit ce3dcf74ed7c13cd57e95df6234b7fcc3b171062[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 16 07:45:35 2017 -0400

    More Bootstrap styling.

[33mcommit 9b9bf658ff534183d40b2886067aab4fc09ff5c7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 15 16:43:02 2017 -0400

    Add node_modules with app.UseStaticFiles.

[33mcommit 3c2e8c6882349bec059f859776c29a25175d0021[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 15 12:47:22 2017 -0400

    Relocate node_modules to ModelRelief root.
    
    Remove Bower dependency.

[33mcommit 9b2193e52c84094e8bee946d31671ee755c72f4c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 15 07:59:01 2017 -0400

    Add node_modules to .gitignore.

[33mcommit 5c07c894e3b37a1b82318ac11ea4335de2e9d767[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 15 07:56:46 2017 -0400

    Add gulp support.

[33mcommit 40b47b9dc8d620f1a164baba190a579ec0a7370b[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 14 14:04:19 2017 -0400

    Add Login and Logout support.

[33mcommit b168aae9733a4fa0b3d9994203337de9bda4e11f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 14 11:05:44 2017 -0400

    Add LoginLogout ViewComponent.

[33mcommit e4d3f84cb9b2f775429da725b8f3cb77177e03d0[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 14 10:08:45 2017 -0400

    Add User creation logic to AccountController.

[33mcommit f9ec81d8d9764efa8804b818035d976422daa99f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 11 07:49:47 2017 -0400

    Add Register form.

[33mcommit 405ef9870c7a96f93dfc88a33c09b40b92120a13[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Mon Jul 10 06:02:02 2017 -0400

    Add Identity migration.

[33mcommit 98767df0bbea42721325f73402e6a8e29e0051cb[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 9 10:08:17 2017 -0400

    Identity Configuration

[33mcommit baa1ec6a53681ec49f53e9864decdee6a791dbcf[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 8 14:12:23 2017 -0400

    Experiments with async and ViewComponents.

[33mcommit 399448284266331c3806f5296b02bbe685ece992[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 8 13:52:15 2017 -0400

    Add Footer ViewComponent

[33mcommit aa10eb1412ded218d4c5f3871063d36b9f3448fd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 8 11:27:19 2017 -0400

    Add Model _Summary Partial View.

[33mcommit a6b1617c4042a341f04e4fc49b05215e1877ee98[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 8 10:16:58 2017 -0400

    Add Edit Form.

[33mcommit fae2aa90e4140e7feac44858187b2f9420f87c1c[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sat Jul 8 08:35:52 2017 -0400

    Cosmetic formatting.
    
    example -> model3D

[33mcommit 6cf4072477917b0e36821444c38e485ab4deb922[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Fri Jul 7 05:35:35 2017 -0400

    Orphans

[33mcommit acba25e22ef35b9766757f8bb8d2ecc2784a22cd[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 6 11:08:52 2017 -0400

    Tag Helpers

[33mcommit 89102cedf1ad6d7e20c0404b8ab91612bd624f7f[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Thu Jul 6 09:06:33 2017 -0400

    Add _ViewImports.
    
    Share common using statements.

[33mcommit 086956e298036fc937b3c10d55b31dafba519433[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Wed Jul 5 05:59:59 2017 -0400

    Add _ViewStart
    
    Share common code (e.g. _Layout.cshtml) across pages.

[33mcommit ad5fe0facb24ecf4d5fbe48842602e3dfa7446f4[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 4 11:56:39 2017 -0400

    Orphans

[33mcommit 7f9d879c801e272b8f577d8f52fda60a583866c7[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 4 11:56:22 2017 -0400

    Remove files and folders that should not be tracked.

[33mcommit 2d62252548cd0a0f7135fa0ce1855d9b3a2bedd9[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Tue Jul 4 09:21:55 2017 -0400

    Add RazorViews: Layout Views

[33mcommit aebab5877bb809d2d8d4e0cec564e848b2105931[m
Author: steveknipmeyer <steve@knipmeyer.org>
Date:   Sun Jul 2 16:02:04 2017 -0400

    Add initial support for SQL Server.

[33mcommit d61ca01443f08c7e55ada9ce267ae1b31637ff7c[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat Jun 10 16:55:38 2017 -0400

    Add Create validation for Model3d.

[33mcommit 0c42b6f888593f7a13027f885692fe6e96c890d2[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat Jun 10 16:03:55 2017 -0400

    Add Models Create.

[33mcommit ad4f2680e09e8a4cf3f91f4f7fb7f0c16a9ed8e9[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat Jun 10 13:26:33 2017 -0400

    Add ModelsController.

[33mcommit 75c5029670ba74bc389d30699e119bfb5ab7f6be[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Thu Jun 8 15:21:50 2017 -0400

    Add parentt Visual Studio folder.

[33mcommit 29a84445a09b1c65e0aa4ee00955e613fb69fc5b[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Fri Jun 2 13:47:05 2017 -0400

    Add IModelLocator and InMemoryModelLocator

[33mcommit 765ff2cae9a4733c4151dc1290f2c7eafe468324[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Fri Jun 2 11:35:51 2017 -0400

    Normalize test models to a uniform size.

[33mcommit 4576780d0b25c6851ca3a24877e244b8a64a432b[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Fri Jun 2 10:54:17 2017 -0400

    Add models folder with test models.

[33mcommit 93b40bf45aac8dfbfe754a03f7058db1818704ba[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Tue May 30 06:00:55 2017 -0400

    Orphans

[33mcommit 59454652b815a78f7e5c54e2ed08904cd5bb8051[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Tue May 30 06:00:41 2017 -0400

    Add new Mime type for .obj and .mtl files .

[33mcommit 802da7364ebba8fe90f7c48a37506e8a584f54d5[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Mon May 29 19:06:54 2017 -0400

    Load Lucv.obj by default.

[33mcommit 40ecfdbb37edeb8e308a5eea44c8f7b598dacc5f[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Mon May 29 12:24:34 2017 -0400

    Experiments with MeshDepthMaterial

[33mcommit 3fe9477e3c4c52fb86d9ede6d4918109010d8988[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Mon May 29 10:57:49 2017 -0400

    More TypeScript conversion.

[33mcommit 6b094793abe81acdb4c287801cd504a1e795006d[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sun May 28 17:52:41 2017 -0400

    Convert  WWOBJLoader2Example to TypeScript.

[33mcommit 63a4a014fe16dad92d2ebfe563275972ad0692e6[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sun May 28 15:16:18 2017 -0400

    Orphans

[33mcommit 5cb12f45a2652425592fa01d99d0caa073b670ae[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sun May 28 15:15:54 2017 -0400

    Some types cleanup.

[33mcommit 45a69c19a05d7a310de578a27b4a91a4fa756153[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sun May 28 14:49:58 2017 -0400

    Compile app.ts as TypeScript.

[33mcommit 5e57502be317df08482cf10196484e0912095ab3[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sun May 28 13:19:08 2017 -0400

    Add threejs typings folder.

[33mcommit 9d06078cdc48a7ffa39998ef2294c8d2767acafc[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sun May 28 12:54:45 2017 -0400

    Add TypeScript configuration.

[33mcommit 6aa19b8f95787e4de8af7aa8d0ffe67aab27dc84[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat May 27 17:36:03 2017 -0400

    Publish to Azure.

[33mcommit 7680897eaa67d5169257ae6049aaf2aacffd1cd1[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat May 27 17:03:20 2017 -0400

    Add example WWOBJLoader2.

[33mcommit 022ff3dd7167375778dd85fbb40aa6f707c0c60c[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat May 27 10:52:51 2017 -0400

    Add three.js

[33mcommit eff8bbf69e5ae64d1e51fc26a613385928f7983a[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat May 27 09:22:28 2017 -0400

    Add ConfigurationBuiilder, Services and IGreeter.

[33mcommit b5c2bc1d880d0be49d5dde5f25310d0a66767756[m
Author: dimensionsjewelry <steve@dimensionsjewelry.com>
Date:   Sat May 27 08:16:39 2017 -0400

    :tada: Added .gitattributes & .gitignore files
