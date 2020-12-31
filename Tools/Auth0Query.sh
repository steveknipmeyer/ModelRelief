#!/bin/bash
# Perform an API query using a JWT token
# Obtain the Bearer token from the Auth0ModelRelief application.

curl --request GET \
  --url "http://localhost:5000/api/v1/cameras/1" \
  --header "authorization: Bearer <token>"
