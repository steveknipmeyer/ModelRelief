:: Starts the ModelRelief Docker containers.

::Builds, (re)creates, starts, and attaches to containers for a service.
cd %MRSolution%Build
docker-compose up

:: stop services
::docker-compose stop

:: Starts existing containers for a service.
::docker-compose start

:: status
:: docker-compose ps