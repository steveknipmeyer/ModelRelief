#!/bin/bash
# XUnit Environment

export MRDatabaseProvider=SQLite
export MRInitializeDatabase=True
export MRSeedDatabase=True

# ASPNET CORE Configuration
export ASPNETCORE_ENVIRONMENT=Production

showenv.sh
