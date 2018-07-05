# Nucache.Explorer

## Web API
The web API is a self contained OWIN/Katana console application, similar to how newer .NET Core apps can be run.

This approach was needed to be used, due to the third party library for storing items in the dictionary (aka nucache) does not support .NET Standard

For more info on the approach, read the tutorial here:

https://docs.microsoft.com/en-us/aspnet/aspnet/overview/owin-and-katana/an-overview-of-project-katana