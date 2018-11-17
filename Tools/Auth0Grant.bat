 curl --request POST ^
  --url "https://modelrelief.auth0.com/oauth/token" ^
  --header "content-type: application/json" ^
  --data "{\"grant_type\":\"password\",\"username\": \"USERNAME\",\"password\": \"PASSWORD\",\"audience\": \"https://modelrelief/api\", \"client_id\": \"ApiClientId\", \"client_secret\": \"ApiClientSecret\"}"

