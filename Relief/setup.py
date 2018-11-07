
import colorama
import os
import re
import sys
import sysconfig
import platform
import pybind11
import subprocess

from distutils.version import LooseVersion
from setuptools import setup, find_packages, Extension
from setuptools.command.build_ext import build_ext

from logger import Logger
from tools import Colors, Tools

# http://www.benjack.io/2018/02/02/python-cpp-revisited.html
class CMakeExtension(Extension):
    def __init__(self, name, sourcedir=''):
        Extension.__init__(self, name, sources=[])
        self.sourcedir = os.path.abspath(sourcedir)

class CMakeBuild(build_ext):

    def __init__(self, dist):
        """
        Initialize an instance of CMakeBuild.
        """
        super().__init__(dist)

        colorama.init()
        self.logger = Logger()

        self.root = os.path.dirname(os.path.realpath(__file__))
        self.unit_tests_executable = 'reliefUnitTests.exe'

    def run(self):
        try:
            out = subprocess.check_output(['cmake', '--version'])

        except OSError:
            raise RuntimeError(
                "CMake must be installed to build the following extensions: " +
                ", ".join(e.name for e in self.extensions))

        if platform.system() == "Windows":
            cmake_version = LooseVersion(re.search(r'version\s*([\d.]+)',
                                         out.decode()).group(1))
            if cmake_version < '3.1.0':
                raise RuntimeError("CMake >= 3.1.0 is required on Windows")

        for ext in self.extensions:
            self.build_extension(ext)

    def copy_unit_tests_executable(self, configuration):
        """ Copy the C++ unit test executable from the build output to the bin folder.
        Parameters
        ----------
        configuration
            Release, Debug
        """

        source = os.path.join(self.root, self.build_temp, configuration, self.unit_tests_executable)
        self.logger.logInformation(f"\nUnit test executable = {source}", Colors.BrightMagenta)

        destination = os.path.join(self.root, "tests", "bin", self.unit_tests_executable)
        Tools.copy_file(source, destination)

    def post_build(self):
        """ Performs cleanup after the completion of the build.
        """
        # N.B. 'setup.py test' leaks build output into the root of the project folder!
        Tools.delete_files([os.path.join(self.root, 'relief.cp36-win_amd64.pyd'), os.path.join(self.root, 'relief.pdb')])

    def build_extension(self, ext):
        extdir = os.path.abspath(
            os.path.dirname(self.get_ext_fullpath(ext.name)))
        cmake_args = ['-DCMAKE_LIBRARY_OUTPUT_DIRECTORY=' + extdir,
                      '-DPYTHON_EXECUTABLE=' + sys.executable]

        cfg = 'Debug' if self.debug else 'Release'
        print (f"Building configuration : {cfg}\n")
        print (f"\nself.build_temp = {self.build_temp}")

        build_args = ['--config', cfg]
        if platform.system() == "Windows":
            cmake_args += ['-DCMAKE_LIBRARY_OUTPUT_DIRECTORY_{}={}'.format(
                cfg.upper(),
                extdir)]
            if sys.maxsize > 2**32:
                cmake_args += ['-A', 'x64']
            build_args += ['--', '/m']
        else:
            cmake_args += ['-DCMAKE_BUILD_TYPE=' + cfg]
            build_args += ['--', '-j2']

        env = os.environ.copy()
        env['CXXFLAGS'] = '{} -DVERSION_INFO=\\"{}\\"'.format(
            env.get('CXXFLAGS', ''),
            self.distribution.get_version())
        if not os.path.exists(self.build_temp):
            os.makedirs(self.build_temp)
        subprocess.check_call(['cmake', ext.sourcedir] + cmake_args,
                              cwd=self.build_temp, env=env)
        subprocess.check_call(['cmake', '--build', '.'] + build_args,
                              cwd=self.build_temp)

        self.copy_unit_tests_executable(cfg)
        self.post_build()

        print()

setup(
    name='relief',
    version='0.1',
    author='Steve Knipmeyer',
    author_email='steve@knipmeyer.org',
    description='ModelRelief image processing Python extensions',
    long_description='',

    # add an extension module named 'relief' to the package
    ext_modules=[CMakeExtension('relief')],

    # add custom build_ext command
    cmdclass=dict(build_ext=CMakeBuild),

    test_suite = 'tests.python',

    zip_safe=False,
)