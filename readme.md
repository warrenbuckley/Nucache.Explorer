# Nucache Explorer
![Nucache Explorer](icon.png)

A desktop utility to view and explore Umbraco V8+ Nucache files which cannot be viewed with a text editor, hence a need for this tool.


## NuCache.Explorer.Server
The web API is a self contained OWIN/Katana console application, similar to how newer .NET Core apps can be run.

This approach was needed to be used, due to the third party library for storing items in the dictionary (aka nucache) does not support .NET Standard

For more info on the approach, read the tutorial here:
https://docs.microsoft.com/en-us/aspnet/aspnet/overview/owin-and-katana/an-overview-of-project-katana

### Example API Request
`http://localhost:5698/api/Nucache/GetNuCacheData?filePath=C:\\Code\\Umbraco-CMS\\src\\Umbraco.Web.UI\\App_Data\\NuCache.Content.db`

### Example API Response
```
{
	"Items": [
		{
			"ContentTypeId": 1061,
			"DraftData": {
				"CultureInfos": {
					"da-dk": {
						"date": "2018-07-09T10:59:14.377Z",
						"name": "Home DK"
					},
					"en-us": {
						"date": "2018-07-09T10:58:25.23Z",
						"name": "Home US"
					},
					"fr-fr": {
						"date": "2018-07-09T11:40:21.3136994+01:00",
						"name": "I am FR Home"
					}
				},
				"Name": "Home US",
				"Properties": {
					"siteName": [
						{
							"culture": "",
							"seg": "",
							"val": "Warrens Variation Website"
						}
					],
					"welcomeMessage": [
						{
							"culture": "en-us",
							"seg": "",
							"val": "<p>Hello from the USA</p>"
						},
						{
							"culture": "da-dk",
							"seg": "",
							"val": "<p>This is some DK welcome message</p>"
						},
						{
							"culture": "fr-fr",
							"seg": "",
							"val": "<p>Hello from FR</p>"
						}
					]
				},
				"Published": false,
				"TemplateId": 1060,
				"VersionDate": "2018-07-09T11:40:21.36Z",
				"VersionId": 18,
				"WriterId": -1
			},
			"Node": {
				"ChildContentIds": [],
				"CreateDate": "2018-07-09T10:58:25.34Z",
				"CreatorId": -1,
				"DraftData": null,
				"Id": 1067,
				"Level": 1,
				"ParentContentId": -1,
				"Path": "-1,1067",
				"PublishedData": null,
				"SortOrder": 0,
				"Uid": "73cbde24-84cf-484d-8621-9d2534bb910c"
			},
			"PublishedData": {
				"CultureInfos": {
					"da-dk": {
						"date": "2018-07-09T10:59:14.377Z",
						"name": "Home DK"
					},
					"en-us": {
						"date": "2018-07-09T10:58:25.23Z",
						"name": "Home US"
					},
					"fr-FR": {
						"date": "2018-07-09T11:40:21.3136994+01:00",
						"name": "I am FR Home"
					}
				},
				"Name": "Home US",
				"Properties": {
					"siteName": [
						{
							"culture": "",
							"seg": "",
							"val": "Warrens Variation Website"
						}
					],
					"welcomeMessage": [
						{
							"culture": "en-us",
							"seg": "",
							"val": "<p>Hello from the USA</p>"
						},
						{
							"culture": "da-dk",
							"seg": "",
							"val": "<p>This is some DK welcome message</p>"
						},
						{
							"culture": "fr-fr",
							"seg": "",
							"val": "<p>Hello from FR</p>"
						}
					]
				},
				"Published": true,
				"TemplateId": 1060,
				"VersionDate": "2018-07-09T11:40:21.36Z",
				"VersionId": 18,
				"WriterId": -1
			}
		}
	],
	"StopClock": 27,
	"TotalItems": 1
}
```

## NuCache.Explorer.Client
The GUI for the application is built with HTML, JS & CSS using Electron.

### Working with the code
```
cd NuCache.Explorer.Client
npm install
npm start
```

### Creating the application
We can only build NuCache Explorer as a windows application that has it's own installer/uninstaller, due to the thrid party lib used in Umbraco V8+ that is creating the NuCache files is Full .NET Framework only & not .NET Standard

```
cd NuCache.Explorer.Client
npm install
npm run dist
```

## Credit

This approach came from this article - https://scotch.io/@rui/how-to-build-a-cross-platform-desktop-application-with-electron-and-net-core
