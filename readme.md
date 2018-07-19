# Nucache.Explorer

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
		},
		{
			"ContentTypeId": 1063,
			"DraftData": {
				"CultureInfos": {
					"da-dk": {
						"date": "2018-07-09T11:03:19.6024266+01:00",
						"name": "News DK"
					},
					"en-us": {
						"date": "2018-07-09T11:03:49.2718344+01:00",
						"name": "News US"
					},
					"fr-fr": {
						"date": "2018-07-09T11:04:10.7071613+01:00",
						"name": "News FR"
					}
				},
				"Name": "News US",
				"Properties": {},
				"Published": false,
				"TemplateId": 1062,
				"VersionDate": "2018-07-09T11:04:10.757Z",
				"VersionId": 9,
				"WriterId": -1
			},
			"Node": {
				"ChildContentIds": [],
				"CreateDate": "2018-07-09T11:02:50.213Z",
				"CreatorId": -1,
				"DraftData": null,
				"Id": 1068,
				"Level": 2,
				"ParentContentId": 1067,
				"Path": "-1,1067,1068",
				"PublishedData": null,
				"SortOrder": 0,
				"Uid": "a54d30ab-8d71-4c87-9945-ce84be44fdfc"
			},
			"PublishedData": {
				"CultureInfos": {
					"da-DK": {
						"date": "2018-07-09T11:03:19.6024266+01:00",
						"name": "News DK"
					},
					"en-US": {
						"date": "2018-07-09T11:03:49.2718344+01:00",
						"name": "News US"
					},
					"fr-FR": {
						"date": "2018-07-09T11:04:10.7071613+01:00",
						"name": "News FR"
					}
				},
				"Name": "News US",
				"Properties": {},
				"Published": true,
				"TemplateId": 1062,
				"VersionDate": "2018-07-09T11:04:10.757Z",
				"VersionId": 9,
				"WriterId": -1
			}
		},
		{
			"ContentTypeId": 1066,
			"DraftData": {
				"CultureInfos": {
					"da-dk": {
						"date": "2018-07-09T11:27:55.5641207+01:00",
						"name": "DK news story"
					},
					"en-us": {
						"date": "2018-07-09T11:27:38.7878893+01:00",
						"name": "Some news story in US"
					},
					"fr-fr": {
						"date": "2018-07-09T11:28:15.5168235+01:00",
						"name": "FR Shock story"
					}
				},
				"Name": "Some news story in US",
				"Properties": {
					"articleTitle": [
						{
							"culture": "",
							"seg": "",
							"val": "News in USA"
						},
						{
							"culture": "en-us",
							"seg": "",
							"val": "Some USA article"
						},
						{
							"culture": "da-dk",
							"seg": "",
							"val": "DK news"
						},
						{
							"culture": "fr-fr",
							"seg": "",
							"val": "FR story"
						}
					],
					"newsStory": [
						{
							"culture": "",
							"seg": "",
							"val": "Something happened in USA"
						},
						{
							"culture": "en-us",
							"seg": "",
							"val": "Hello from USA"
						},
						{
							"culture": "da-dk",
							"seg": "",
							"val": "Something DK"
						},
						{
							"culture": "fr-fr",
							"seg": "",
							"val": "Hello from FR"
						}
					]
				},
				"Published": false,
				"TemplateId": 1065,
				"VersionDate": "2018-07-09T11:28:15.567Z",
				"VersionId": 17,
				"WriterId": -1
			},
			"Node": {
				"ChildContentIds": [],
				"CreateDate": "2018-07-09T11:26:20.23Z",
				"CreatorId": -1,
				"DraftData": null,
				"Id": 1070,
				"Level": 3,
				"ParentContentId": 1068,
				"Path": "-1,1067,1068,1070",
				"PublishedData": null,
				"SortOrder": 0,
				"Uid": "7e3f5500-8537-4ab5-aaf4-926ba0c706b4"
			},
			"PublishedData": {
				"CultureInfos": {
					"da-DK": {
						"date": "2018-07-09T11:27:55.5641207+01:00",
						"name": "DK news story"
					},
					"en-us": {
						"date": "2018-07-09T11:27:38.7878893+01:00",
						"name": "Some news story in US"
					},
					"fr-FR": {
						"date": "2018-07-09T11:28:15.5168235+01:00",
						"name": "FR Shock story"
					}
				},
				"Name": "Some news story in US",
				"Properties": {
					"articleTitle": [
						{
							"culture": "",
							"seg": "",
							"val": "News in USA"
						},
						{
							"culture": "en-us",
							"seg": "",
							"val": "Some USA article"
						},
						{
							"culture": "da-dk",
							"seg": "",
							"val": "DK news"
						},
						{
							"culture": "fr-fr",
							"seg": "",
							"val": "FR story"
						}
					],
					"newsStory": [
						{
							"culture": "",
							"seg": "",
							"val": "Something happened in USA"
						},
						{
							"culture": "en-us",
							"seg": "",
							"val": "Hello from USA"
						},
						{
							"culture": "da-dk",
							"seg": "",
							"val": "Something DK"
						},
						{
							"culture": "fr-fr",
							"seg": "",
							"val": "Hello from FR"
						}
					]
				},
				"Published": true,
				"TemplateId": 1065,
				"VersionDate": "2018-07-09T11:28:15.567Z",
				"VersionId": 17,
				"WriterId": -1
			}
		}
	],
	"StopClock": 27,
	"TotalItems": 3
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