
# Team Storytellers of Canada


##  Description

We are planning to build a mobile app that allows storytellers and listeners to share their own stories, respond to other stories with their own story, and listen to the Storytellers of Canada radio station. The stories that users can submit will be voice recordings of up to 3 minutes in length. Our app will allow for more interactivity as they are now able to share their own words, which will hopefully retain listeners and attract new storytellers. It provides a clean and user-friendly interface for users to explore fascinating stories that they would not have had a chance to hear if not for the Storytellers of Canada application.

The problem we are trying to solve is that although they have a radio station set-up, they lack listeners. Their organizational and artist goals include making connections through story, but connections require interactive opportunities that are lacking with the current setup. For example, a storyteller or listener may listen to the Storytellers Radio station but feel disconnected because they cannot share their own story, causing them to disengage from the content. Storytellers of Canada need a platform that allows users to interact with each other and share experiences, and that is what we aim to create.

Our application solves this problem because it creates a way for Storytellers of Canada to reach out to a younger audience that primarily uses mobile applications for consuming content, ultimately increasing the amount of their listeners. Previously, the only online resources that the organization had for telling stories was through their online radio station and a short catalogue of stories on their website. This meant there was no way for users to have on-demand access to the entire library of stories that Storytellers of Canada has to offer. As well, although the organization holds many in-person storytelling events and sells CDs on their website, these are not very appealing to the tech-savvy audience they wish to reach out to, showing a stronger need for the mobile application we developed. As well, by creating a feature that allows listeners to submit their own responses, we have included a level of interactivity never seen before with Storytellers of Canada and this should hopefully retain users and appeal to more potential listeners.


## Key Features

With the current first iteration of the application, users will be able to access many of the core functionalities for the Storytellers of Canada app.

### Login and Registration

When first opening the application, users are greeted with a screen prompting them to sign in with a username and password. If the user does not yet have an account, there is a register account button which will take them to the registration screen. The user also has the ability to login as a guest user if they do not wish to make an account at that moment.

### Home Screen

Users are able to infinitely scroll through a feed of user submitted audio story recordings. The user has the ability to play and pause this story, like the story, and reply to the story with a text or audio story response.

### Create Story
In the bottom right of the home screen, there is a button which prompts the user to create a new audio recording. Once pressed, users are taken to a new screen where they can record a 3 minute story directly through the app. The user can play back their recording and once satisfied are able to submit a title, description, and assign appropriate tags to the story. Note that unfortunately we are currently having issues with cross platform support regarding listening to audio recordings made on separate platforms. We hope to have this issue resolved soon.

### Responses 
Users are able to view all responses to a story/comment by selecting the story or comment card. This will bring the user to a separate screen where they can scroll through all responses made to that story/comment.

### Admin Functionality
Admin user accounts are given access to an extra tab at the bottom of the screen. This tab contains all newly created stories and comments, and gives the admin the option to approve or deny each story prior to being seen on the home feeds of general users.

### SC-Radio-CC Radio Player
A tab at the bottom of the screen is dedicated to listening to the live Storytellers of Canada radio station. Users are able to view what story is currently playing on the radio, and play and pause at will.

### StorySave Collection
A tab at the bottom of the screen brings you to another feed, filled with curated stories that are part of the Storytellers of Canada StorySave collection. Users will be able to infinitely scroll through this feed, play and pause the story, like the story, and reply to the story in the same way as the user submitted stories.

## Instructions
### Step One: Getting the app on your phone
**For end users:**

- Download the app from the App Store (iOS) or Play Store (Android)

- We have not deployed this app yet, but will after our final version is polished

For TAs / Testing:

**On Android:**

- Ensure you have the Expo app downloaded on your phone

	([https://play.google.com/store/apps/details?id=host.exp.exponent](https://play.google.com/store/apps/details?id=host.exp.exponent))

- Open the following link on your phone

	[https://expo.io/--/to-exp/exp%3A%2F%2Fexp.host%2F%40jamesmcurrier%2FStorytellersApp](https://expo.io/--/to-exp/exp%3A%2F%2Fexp.host%2F%40jamesmcurrier%2FStorytellersApp)

- A test version of the app should open on your phone

**On iOS:**

- Ensure you have the Expo Client app downloaded on your phone

	([https://itunes.com/apps/exponent](https://play.google.com/store/apps/details?id=host.exp.exponent))

- Open the following link on your phone

	[https://expo.io/--/to-exp/exp%3A%2F%2Fexp.host%2F%40jamesmcurrier%2FStorytellersApp](https://expo.io/--/to-exp/exp%3A%2F%2Fexp.host%2F%40jamesmcurrier%2FStorytellersApp)

- A test version of the app should open on your phone

### Step Two: Sign Up / Sign In (Optional)
-   If you don’t want an account, you can simply tap **Login as a Guest** to proceed to Step Three. Note that you will not be able to reply or create new stories using a guest account
    
-   If you don’t have an account yet, tap **Register a New Account**, enter your details, and tap **Register**
    

After you’ve made an account, enter your login information and tap **Sign In**

### Step Three: Welcome to Our App
-   The first tab is the **Home Screen**. This is where all the user stories will appear. You can tap on any of these stories to view it’s comments and replies. You can also tap the blue microphone in the bottom right to share your own stories here!
    
-   The second tab is the **StorySave Collection**. This is where you can go to listen to any of the stories from the Storytellers of Canada.
    
-   The third tab is the **Radio**. This is where you can listen to a live stream of the Storytellers of Canada radio station.
    
-   The fourth tab is the **Admin Tab** and will only appear if you are an admin user. (Use username: “test”, password: “test”, to test this). Here you can approve or reject new stories that are awaiting approval.
    
-   That’s it! This was fun to make, and we hope you have fun using it!

## Development Requirements

### Frontend:

Our frontend is a react native application integrated with the Expo framework.

To begin the setup, follow the instructions provided by React for setting up a development environment.

Following the Expo CLI Quickstart will give you the bare minimum setup to run Expo using a physical device as a testing environment. If you wish to set up an Android or IOS emulator to run your application instead, refer to the React Native CLI Quickstart guide.

[https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

After this has been setup, you must ensure that all dependencies are satisfied. We are using several libraries to improve ease of development and provide us with convenient components. Some of the most important libraries used include React Native Paper for UI components, Axios for HTTP Requests, and React Navigation for navigating between screens. To install all the required dependencies, run `yarn install` in the application directory. Once these dependencies are installed, you are ready to develop the application, seeing changes on the testing device as code changes are made locally.

To do this, ensure that you start the application, issuing the `yarn start, expo start, or npm start` command in the application directory. This will start up a development server that will enable you to see changes in the application in real time. After this, you will be prompted to select from the given commands the method you wish to run the application (android emulation, scanning QR code with the expo mobile app etc). If you wish to select an emulator, make sure that this emulator is already running before selecting this option.


### Backend.

Our backend is a Flask Api built using the Flask-restful framework to improve code structure and provide useful API functionality. To run this application, install all of the dependencies in the requirements.txt file, running `pip (or pip3) install -r requirements.txt`. To set up the connection with our DigitalOcean S3 storage, you will need to create a folder /Services/instance and place a config.py file within it. For security reasons, we have not made this config public, and if you wish to run the API locally we ask that you contact us to receive the security information. After this configuration is complete, run the app.py file. If you wish to connect the frontend with this local API, you must specify the host name for the app as your local IP address and change the HOST variable in config.tsx to point to this local IP address.

## Deployment and Github Workflow
We established early on that each team member would be in charge of a specific feature, allowing each member to work on their section without merge conflicts.

Each member of the team generated their own feature branches as needed, and contained their development within this branch. Once this feature was at a stable level, this member would make a pull request into the master branch so that others could build upon this functionality if needed. Due to time constraints, we did not integrate thorough code review into this process, but we also came to feel that at our stage, we are all masters of our individual feature domains and thus the most qualified person to review our code is ourselves. During development, we would run everything locally. This meant running the API on our local IP address and configuring the application to use this IP address. Expo was used to deploy the react native application and enabled us to have real time updates while coding. The decision to use Expo rather than base react native actually was a decision that came after we had already begun development. This required a recreation of the application to make an expo managed app. This was a large decision, but we made this decision due to the ease of deployment and integration across platforms that Expo provides. Due to not entirely finalizing our deployment set up with our partner at this time, we have currently deployed the app in a test environment. We are running the API and our S3 storage solution using a DigitalOcean account provided by our partner, but we have not been provided a stable domain and are not ready to deploy a production version of the application at this time. Due to this, and the fact that we are still actively developing the application such that we are running the API locally at all times, we did not feel the need to set up a fully automated pipeline for this temporary testing environment. We will set this up using CircleCi to automate our deployments to DigitalOcean once we have finalized our production setup. We are also using a MySQL database hosted on AWS for this test environment. This is because once we do deploy a production version, we do not want our internal development and testing to affect the production database. The production database that we will be using is a DigitalOcean hosted MySQL database.

## Licenses
We are using the MIT license for our codebase.

Two factors led to this decision:

1.  We are using multiple libraries, all of which have an attribution requirement required by the MIT license, as such, we decided the simplest way to create our license was to use the MIT license and add all the attributions we were required to include so that we do not have to deal with different attribution requirements.
    
2.  To shield ourselves from any legal liability arising from any negligence or mistake when developing the software, and/or any issue that may cause harm to the partner and/or their users. Furthermore, it also means that we have no obligation to the partner after the course is over and makes it clear that we are not responsible for maintaining any portion of the service in the future.
    
This license does not have much effect on our development as all it does is allow other people to use it, while shielding us from any legal liability. As we retain all rights to the code, if we wanted to in the future, we could use it

If we were to make the Github repository public, that anyone could take our code, modify it, and potentially publish it to the Google play or App Store.
