:: Builds the ModelRelief Docker containers.

docker build -t modelrelief --build-arg MRPORT=%MRPort% -f Build\DockerFile.modelrelief  .

::docker run -d --entrypoint "cmd" -p 8080:60655 modelrelief
::docker run -it -p 8080:60655 modelrelief
::docker run -d -p 8080:60655 modelrelief
::docker run -d -e "ASPNETCORE_ENVIRONMENT=Production" -p 8080:60655 modelrelief
:: docker exec <container> netstat -a