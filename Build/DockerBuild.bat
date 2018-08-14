:: Builds the ModelRelief Docker containers.

docker build -t modelrelief --build-arg MRPORT=%MRPort% -f Build\DockerFile.modelrelief  .
