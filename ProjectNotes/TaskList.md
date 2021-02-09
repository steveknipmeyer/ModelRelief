## Commit Notes

#### Issues
    How does lucy.sfp get corrupted?
        -rw-r--r--  1 stephen stephen 1048576 Feb  4 14:22 lucy.sfp (1 additional byte)
<div style="font-size:9pt">

### Front End (JavaScript)

#### Interfaces

The FE DTO interfaces are used to facilitate construction of DTO models from HTTP.

|Graphics||DTO (HTTP)|
|--|---|---|
|||IModel||
|||IFileModel||
|||IGeneratedFileModel||
|||ICamera||
|||IDepthBuffer||
|||IMesh||
|||IMeshTransform||
|||IModel3d||
|||INormalMap||
|||IProject||

**DTO**
```javascript
export interface IModel
export interface IFileModel extends IModel
export interface IGeneratedFileModel extends IFileModel

export interface ICamera extends IModel
export interface IDepthBuffer extends IGeneratedFileModel
export interface IMesh extends extends IGeneratedFileModel
export interface IMeshTransform extends IModel
export interface IModel3d extends IFileModel
export interface INormalMap extends IGeneratedFileModel
export interface IProject extends IModel
```

#### Base Classes
DTO models are in an inheritance chain so they can share common functionality such as API HTTP requests.

|Graphics||DTO (HTTP)|
|--|---|---|
|Model||Dto.Model|
|FileModel||Dto.FileModel|
|GeneratedFileModel||Dto.GeneratedFileModel|

**Graphics**
```javascript
export class Model implements IModel
export class FileModel extends Model<T> implements IFileModel
export class GeneratedFileModel extends FileModel<T> implements IGeneratedFileModel
```
**DTO**
```javascript
export class Model<T extends IModel> implements IModel
export class FileModel<T extends IFileModel> extends Model<T> implements IFileModel
export class GeneratedFileModel<T extends IGeneratedFileModel> extends FileModel<T> implements IGeneratedFileModel
```

#### Concrete Classes

|Graphics |Implementation||DTO (HTTP) |Implementation||Notes|
|---|---|---|---|---|---|---|
|Camera|IModel<br>Model||Dto.Camera|IModel, ICamera<br>Dto.Model||THREE.Camera|
|DepthBuffer|IGeneratedFileModel<br>GeneratedFileModel||Dto.DepthBuffer|IGeneratedFileModel, IDepthBuffer<br>Dto.GeneratedFileModel||
|Mesh|IGeneratedFileModel<br>GeneratedFileModel||Dto.Mesh|IGeneratedFileModel, IMesh<br>Dto.GeneratedFileModel||THREE.Mesh|
|MeshTransform|IModel<br>Model||Dto.MeshTransform|IModel, IMeshTransform<br>Dto.Model|||
|Model3d|IFileModel<br>FileModel||Dto.Model3d|IFileModel, IModel3d<br>Dto.FileModel||THREE.Mesh|
|NormalMap|IGeneratedFileModel<br>GeneratedFileModel||Dto.NormalMap|IGeneratedFileModel, INormalMap<br>Dto.GeneratedFileModel||
|Project|IModel<br>Model||Dto.Project|IModel, IProject<br>Dto.Model||


**Graphics**
```javascript
export class Camera extends Model
export class DepthBuffer extends GeneratedFileModel
export class Mesh extends GeneratedFileModel
export class MeshTransform extends Model
export class Model3d extends FileModel
export class NormalMap extends GeneratedFileModel
export class Project extends Model
```
**DTO**
```javascript
export class Camera extends Model<Camera> implements ICamera
export class DepthBuffer extends GeneratedFileModel<DepthBuffer> implements IDepthBuffer
export class Mesh extends GeneratedFileModel<Mesh> implements IMesh
export class MeshTransform extends Model<MeshTransform> implements IMeshTransform
export class Model3d extends FileModel<Model3d> implements IModel3d
export class NormalMap extends GeneratedFileModel<NormalMap> implements INormalMap
export class Project extends Model<Project> implements IProject
```

___
### Back End (NET Core)

#### Interfaces

|DTO (HTTP)||Domain (DB)|
|---|---|---|
|Dto.IModel|||
|Dto.IFileModel|
|Dto.IGeneratedFileModel|

**DTO**
```csharp
public interface IModel
public interface IFileModel : IModel
public interface IGeneratedFileModel : IFileModel
```

#### Base Classes
Domain models are in an inheritance chain so they can share common functionality such as file operations.
<span style="color:red">
Implementing a hierarchy of DTO models creates potential issues with DataAnnotation attributes sucn as Display(Name).
</span>


|DTO (HTTP)||Abstract Domain (DB)|
|--|--|--|
|||Domain.DomainModel|
|||Domain.FileDomainModel|
|||Domain.GeneratedFileDomainModel|


**Domain**
```csharp
public abstract class DomainModel
public abstract class FileDomainModel : DomainModel
public abstract class GeneratedFileDomainModel : FileDomainModel
```
#### Concrete Classes

|DTO (HTTP) |Implementation|Notes||Domain Models (DB) |Implementation|
|---|---|---|---|---|---|
|Dto.Camera|Dto.IModel|||Domain.Camera|DomainModel|
|Dto.DepthBuffer|Dto.IGeneratedFileModel|||Domain.DepthBuffer|GeneratedFileDomainModel|
|Dto.Mesh|Dto.IGeneratedFileModel|||Domain.Mesh|GeneratedFileDomainModel|
|Dto.MeshTransform|Dto.IModel|||Domain.MeshTransform|DomainModel|
|Dto.Model3d|Dto.IFileModel|||Domain.Model3d|FileDomainModel|
|Dto.NormalMap|Dto.IGeneratedFileModel|||Domain.NormalMap|GeneratedFileDomainModel|
|Dto.Project|Dto.IModel|||Domain.Project|DomainModel|
|||||

**DTO**
ModelReliefFeatures
```csharp
public class Camera : IModel
public class DepthBuffer : IGeneratedFileModel
public class Mesh : IGeneratedFileModel
public class MeshTransform : IModel
public class Model3d : IFileModel
public class NormalMap : IGeneratedFileModel
public class Project : IModel
```
**Domain**
 ModelRelief\Domain
```csharp
public class Camera : DomainModel
public class DepthBuffer  : GeneratedFileDomainModel
public class Mesh : GeneratedFileDomainModel
public class MeshTransform : DomainModel
public class Model3d : FileDomainModel
public class NormalMap  : GeneratedFileDomainModel
public class Project : DomainModel
```
___
</div>
        -rw-r--r--  1 stephen stephen 1048577 Feb  5 15:19 lucy.sfp

#### General
    Documentation
    Settings Page
    Upload
    Hosting
    Solver Generate result
        Result
        Processing time
        Polygons

    Gravatar

#### Models
    OBJ viewer has missing polygons.
        Plunderbuss
        House

    Review all mesh generation settings for delivered models.
    Attenuation Decay.
        It is 0.9 in the thesis but there are values of 0.6 in the sample data set.

#### UI
        Why is Sigma Low hidden?
        Add switch for Development controls. (Settings Gear?)
        Create a video or an animation?
        Workflow page
            Illustrate with images from Explorer!

#### Solver
    Runtime error does not propagate back to UI.
        The runtime failure happens during the DependencyManager processing (FileGenerate) so it is not synchronous with the Put request.
            The Solver could mark the output mesh has invalid amd emcode the status result in the contents.
        Should the GeneratedFile be deleted if the Solver fails?

    Silhouette
        Blend profile into mesh form.

#### Build
    Review target=nginx handling in Builder.py.
        python Build\builder.py --target nginx --deploy True
        Elevated permissions are required in Builder to deploy to delete /var/www.
        Can the Nginx configuration be accomplished only through /etc/nginx/sites-available/default?

    Prove with clean Ubuntu installation!
        Add a test account.

    Convert Alpha to a Linux server.

#### Python
    Why does venv not add the Python 3.8 include files?
    Why does the 1st mayavi install fail with a vtk module error?

### Security
    Remove steve@knipmeyer.org.
    Azure Key Secrets
        Review settings in AzureKeyVault.
        Mock azurekeysecrets.json.
            Move to a new settings file?
            How should the contact e-mail address be defined?

### Refactoring
    Review all casing of files and directories.
    Tools -> bin

### Project
    Structure GitHub repo using recommended best practices.
    Add OneNote ModelRelief notebook.
    Review ProjectNotes
        Check lists ([])
        Remove backslashes.
    Documentation
        Document DepthBufferView and analyze tools (e.g. HtmlLogger).
        Document VcXsrv
        AzureKeyVault
        Solver
        Explorer
        pyamg warning
            pyamg/gallery/stencil.py:110: FutureWarning: Using a non-tuple sequence for multidimensional indexing is deprecated; use `arr[tuple(seq)]` instead of `arr[seq]`. In the future this will be interpreted as an array index, `arr[np.array(seq)]`, which will result either in an error or a different result.
            diags[s] = 0
        (Hidden) DepthBufferView and NormalMapView
        Desmos attenuation graph
        Document Solver defaults as active settings (no Web UI).
        SystemSettings.json
            logging
            developmentgui
        Features not published
            clipping planes
            perspective cameras
        API
    Remove References
        *.exe
        ModelRelief.dgml (Linux?)

### Publishing
    Host on Digital Ocean.
    KAK invitation
    Notices:
        3D CAD Jewelry
            https://matrixusergroup.com/
        CNC
        ArtCAM
        Vectrix
        3D Printing
        HackerNews

### SSL
    https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04
    https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/

### License
    Replace copyright headers with MIT license notice.

