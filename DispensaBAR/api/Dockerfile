# ---- Build ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Dispensa.Api/Dispensa.Api.csproj Dispensa.Api/
RUN dotnet restore Dispensa.Api/Dispensa.Api.csproj
COPY Dispensa.Api/ Dispensa.Api/
RUN dotnet publish Dispensa.Api/Dispensa.Api.csproj -c Release -o /app --no-restore

# ---- Run ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
# The API listens on 8080 (only inside the Docker network, Nginx forwards /api here)
EXPOSE 8080
ENTRYPOINT ["dotnet", "Dispensa.Api.dll"]
