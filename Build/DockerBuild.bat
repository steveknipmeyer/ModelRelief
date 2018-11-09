:: Builds the ModelRelief Docker containers.

docker build -t modelrelief --build-arg MRPORT=%MRPort% -MRPORTSecure=%MRPortSecure% f Build\DockerFile.modelrelief  .
