:: Builds the ModelRelief Docker containers.

docker build -t modelrelief -f Build\DockerFile.modelrelief  .

::docker run -it modelrelief
::docker run -d -p 4000:80 modelrelief