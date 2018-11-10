:: Builds the ModelRelief Docker containers.

docker build -t modelrelief --build-arg MRPORT=%MRPort% --build-arg MRPORTSecure=%MRPortSecure% -f Build\DockerFile.modelrelief  .

