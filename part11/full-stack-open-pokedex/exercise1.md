I chose C# as the language.

For linting, SonarLint seems the most popular one, but VSCode accepts '.editorconfig' files to handle linting itself, and that's probably the most straightforward way set things up.

For testing, I'd use MSTest, which is built in to Visual Studio and would have an "out-of-the-box" compatibility, not needing to install and set up extra packages. Also, configuration may even sync with the IDE. Other options are be NUnit and xUnit, and the community seems to fight between them because NUnit is "older" than xUnit and fixes some of its 'structural issues', but it's also way better documented, has a bigger community and lacks others shortcomings xUnit introduced.

For building, MSBuild seems the "classic" option, while CMake appears to be the "dev friendly" one, auto-managing and updating libraries and handling cross-compatibility. I think CMake would be more useful, as the team would be able to build with the same parameters, and seems to be easier to config.

A good CI alternative would be Azure DevOps, as we would be dealing with a Microsoft framework all along the way (C# -> VSCode/VS -> MSTest -> Azure). Also, it has a native VS/VSCode integration and seems to be almost free for small teams as ours.

About going self-hosted VS cloud-based, I'd go with cloud because, as a small team, our priority is to be "synced" and pour resources into development. We'd need experience, a member to be CI/CD expert, and have a good budget to go local. I'd prefer having things "automated" and self-backed up first so we don't risk anything, especially having such a complete and almost free environment as C# is.
