#### Commit     
### General      
    Test Jupyter notebooks.
    Document VSCode extensions used.

    mayavi wheel fails but setup.py succeeds.
        Stored in directory: /home/stephen/.cache/pip/wheels/f6/a0/82/148885ef19b33cc55e08a00c06e5bb7565744560171b979bfd
        Building wheel for mayavi (setup.py) ... error
        ERROR: Command errored out with exit status 1:
        command: /home/stephen/projects/ModelRelief/devenv/bin/python3 -u -c 'import sys, setuptools, tokenize; sys.argv[0] = '"'"'/tmp/pip-install-o55o6tha/mayavi/setup.py'"'"'; __file__='"'"'/tmp/pip-install-o55o6tha/mayavi/setup.py'"'"';f=getattr(tokenize, '"'"'open'"'"', open)(__file__);code=f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' bdist_wheel -d /tmp/pip-wheel-nxmoj476
            cwd: /tmp/pip-install-o55o6tha/mayavi/
        Complete output (12 lines):
        ********************************************************************************

            Numpy is required to build Mayavi correctly, please install it first.

        ********************************************************************************
        Traceback (most recent call last):
            File "<string>", line 1, in <module>
            File "/tmp/pip-install-o55o6tha/mayavi/setup.py", line 406, in <module>
            raise RuntimeError(msg)
        RuntimeError:
            Numpy is required to build Mayavi correctly, please install it first.

        ----------------------------------------
        ERROR: Failed building wheel for mayavi
        Running setup.py clean for mayavi
        Building wheel for pandocfilters (setup.py) ... done

    
    Bootstrap
        Theme colors. What is the proper way to create a color palette?
### Conventions
    Review all casing of files and directories.
    Tools -> tools
### Security
    Auth0
    Review Azure Key Vault dependency.
### Project
    Git
        Consolidate contributor names?
            https://stackoverflow.com/questions/4981126/how-to-amend-several-commits-in-git-to-change-author/25815116#25815116
        Remove personal email from commit history.

    Structure GitHub repo using recommended best practices.
    Add OneNote ModelRelief notebook.
    Add Postman ModelRelief collection.
    Documentation
        gulp tasks (e.g. serve)
        Document DepthBufferView and analyze tools (e.g. HtmlLogger).
        Document VcXsrv
        Solver
        Explorer
        pyamg warning
            pyamg/gallery/stencil.py:110: FutureWarning: Using a non-tuple sequence for multidimensional indexing is deprecated; use `arr[tuple(seq)]` instead of `arr[seq]`. In the future this will be interpreted as an array index, `arr[np.array(seq)]`, which will result either in an error or a different result.
            diags[s] = 0
        (Hidden) DepthBufferView and NormalMapView
        Desmos attenuation graph
        Document Solver settings with no Web UI.
        Defaults.json
            logging
            developmentui
        Ux Features not published
            clipping planes
            perspective cameras
        API
        ModelRelief.dgml (Linux?)
### Publishing
    KAK invitation
    Notices:
        3D CAD Jewelry
            https://matrixusergroup.com/
        CNC
        ArtCAM
        Vectrix
        3D Printing
        Hacker News
### Metrics
    .cs = 19164
    .ts = 15484
    .py = 7212
    .cpp = 1258
    Total lines = 43118
### License and Copyright
    https://opensource.google/docs/releasing/preparing/
### UI
    Create a video or an animation?
    Workflow page
        Illustrate with images from Explorer!
