:: Builds the ModelRelief Docker containers.

docker build -t modelreliefbase -f Build\DockerFile.modelreliefbase  .
docker build -t modelrelief -f Build\DockerFile.modelrelief  .

::docker run -it modelrelief