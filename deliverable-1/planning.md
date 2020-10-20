# Team Storytellers of Canada

## Product Details
 
#### Q1: What are you planning to build?

Storytellers of Canada (SS-CC) is a group of storytellers devoted to connecting people, reflecting culture, and inspiring discovery through the art of storytelling. Their biggest problem is that though they have a radio station set-up, they lack listeners. Their organizational and artist goals include making connections through story, but connections require interactive opportunities that are lacking with the current setup. For example, a storyteller or listener may listen to the Storytellers Radio station but feel disconnected because they cannot share their own story, causing them to disengage from the content. Storytellers of Canada need a platform that allows users to interact with each other and share experiences, and that is what we aim to create. 

In order to tackle this issue, we are planning to build a mobile app that allows storytellers and listeners to share their own stories, respond to other stories with their own story, and listen to the Storytellers of Canada radio station. The stories that users can submit will be voice recordings of up to 3 minutes in length.  Our app will allow for more interactivity as they are now able to share their own words, which will hopefully retain listeners and attract new storytellers.

In terms of functionality, firstly, our app will allow users to create a personal profile. The user can then listen to the live SC-Radio-CC’s radio station, a curated stored story collection told by professional storytellers, and a feed of stories (each up to 3 minutes in length) posted by other users of the app. Users can also search for tags; for example, a user can search for “summer” and a list of stories with the tag “summer” will appear. Next, users will be able to record their own story on the app and post it for everyone to listen. In addition, users can reply to other users’ stories by simply clicking a reply icon and recording their response story. Every user will be able to see all the replies as well, with a similar structure to Twitter.  Our app will also grant employees elevated permissions to vet user stories prior to being publicly available on the application. 

<ins>Mockup:</ins><br>
[Mockup of our application on Figma](https://www.figma.com/file/x3QOGBEvcRuAzABjS5dh8Y/Storytellers?node-id=0%3A1)


#### Q2: Who are your target users?

Our target users are French and English speaking Canadians wanting to listen to interesting stories and/or share their own experiences. Firstly, we aim to target the current listeners of the Storytellers of Canada radio station, transitioning them to become not only consumers of stories but also producers of stories. We then want to extend this target net to attract a wider range of Canadians, creating a network of shared knowledge and stories from people of all ages and backgrounds.  Another specific group to target would be members of the Canadian storytelling community, both those who already have a relationship with Storytellers of Canada as well as those who currently have no presence on the platform. By targeting these members, we would be attracting talented storytellers, enriching the content on our new platform and driving further interaction with the application. 

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

Our application addresses the issues of engagement and interactivity that exist with the current method of accessing Storytellers of Canada content. Currently, Storytellers of Canada only has a website where people can stream their radio station and listen to stored story content. We aim to provide an application which acts as a centralized hub for all Storytellers of Canada content, giving them easy access to the radio station as well as direct access to the stored stories collection, but also provides them with the opportunity to interact with other users and share their own stories. This is the differentiating factor between the current implementation and our application, and the factor that will keep users engaged. With this app, users will be able to share their own story as well as be informed, entertained, and inspired by the posted stories of other users. Users will also use our app to interact with each other by replying to other posted stories, driving conversation around stories that would not exist with the current website. This provides users the opportunity to dynamically engage in content, which retains their attention greater than passive engagement. 

In addition to this, we aim to make our application very simple and familiar to use, with a typical simple social media structure similar to Twitter, LinkedIn, etc.  Due to this, existing Storytellers of Canada users will be able to rapidly adapt to consuming content with our application, and the familiar interface will provide ease of entry for new users to discover Storytellers of Canada. 

#### Q4: How will you build it?

<ins>Tech Stack and Deployment:</ins><br>
Our mobile app and website will all be developed using React Native. We will develop our backend using Python and Flask, which will be run on an EC2 instance on Amazon Web Services. The database will also be run on AWS using their RDS service. For now, all our entities such as user accounts and user uploaded stories will be stored on S3 until we receive information from the partner about integrating our storage solution with their own. The existing stored story collection is currently being migrated into a more robust cloud solution, and further details about how we will access these stories will come in the future. We will deploy the mobile apps using Google Play and the Apple App Store. The website will be hosted on the EC2 instance running the backend. We are planning to use two different repositories, one for the backend and the other for the React app/website.

<ins>Architecture:</ins><br>
Our high level architecture and components can be seen in the UML diagram below:<br>
![UML Diagram](https://github.com/csc301-fall-2020/team-project-19-storytellers-of-canada/blob/master/deliverable-1/UML.jpg)<br>
This high level architecture outlines a very simplistic model that we can utilize to create our first MVP. With this said, this architecture is modular enough for us to easily expand upon it to add additional functionality such as text comments.

<ins>Third Party Applications/APIs:</ins><br>
We may have to use third party applications/apis depending on where the partner has stored the story save collection that we are supposed to access. This is unclear at this point in time.

<ins>Testing Strategy:</ins><br>
We will utilize CircleCI if possible (due to lack of credits) to build an automated testing CI/CD pipeline. We will create thorough unit tests for our backend and frontend where applicable which run upon pull request into our staging branch. We plan to have a continuous delivery system, where we run integration and UI tests as well as end to end user testing prior to deployment to production to ensure that we only deploy quality code to production.


#### Q5: What are the user stories that make up the MVP?
 
1. **As a user, I want to create an account in order to start posting my own stories**<br>
    * **Acceptance Criteria:** The user is prompted to create a username and password, the account is created and the user will be prompted to login.

2. **As a user, I want to access the Storytellers of Canada radio station in order to listen to the station**<br>
    * **Acceptance Criteria:** The radio station link is available on the home page and once clicked will play through the device's audio with options to play/pause.

3. **As a user, I want to record my story and submit it for review in order to share my story to the other users**<br>
    * **Acceptance Criteria:** Once a user clicks the button to add a story, a recording button is displayed which when clicked, will display an icon indicating that the device is recording. Once the user clicks stop or the time limit is reached, buttons for play/pause and re-recording will display along with a submit option. When the submit button is clicked, a popup will show telling the user that their submission is under review.

4. **As an admin, I want to review and approve submitted stories in order to have the stories published on the app or rejected and deleted**<br>
    * **Acceptance Criteria:** A tab is displayed that allows admins to review submitted stories that each have play/pause buttons along with options to accept/reject. If approved, the story is published to all users and is marked as approved in the user's account whereas if rejected, the story is deleted and marked as rejected in the user's account.

5. **As a user, I want to reply to other users’ stories in order to interact with them**<br>
    * **Acceptance Criteria:** A reply icon is displayed on every story card that when clicked, will display a recording button. Once the user selects record, an icon indicating that the device is recording will appear. Once the user clicks stop or the time limit is reached, buttons for play/pause and re-recording will display along with a submit option. When the submit button is clicked, a popup will show telling the user that their submission is under review. Assuming this story is approved, the story will then appear under the other user's story as a response, preserving chronological order.   

----

## Process Details

#### Q6: What are the roles & responsibilities on the team?
 
<ins>Team Members</ins>
* <ins>Priyanshu Arora - Scrum Master and Full Stack Developer</ins>
  * Responsible for organizing and updating the GitHub Projects board
  * Responsible for organizing internal meetings
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Experience with frontend development (ReactJS), Python, and API development with Spring Boot
  * **Weaknesses:** No experience with Flask, MP3 libraries, and lack of experience with UI design
* <ins>Aidan Brasseur - Product Manager and Full Stack Developer</ins>
  * Responsible for organizing meetings and communications with our partner
  * Responsible for driving key conversations regarding the core vision of the application
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Experience with Python, API development, and database management (SQL)
  * **Weaknesses:** Unfamiliar with UI design, React Native, and Flask
* <ins>James Currier - Full Stack Developer and Designer</ins>
  * Responsible for handling development tasks (both frontend and backend) 
  * Responsible for initial app mockups and progressive design mockups
  * **Strengths:** Experience with React Native, Python, and working with clients to determine designs
  * **Weaknesses:** No experience with Flask, iOS development, and CI tools
* <ins>Saeyon Sivakumaran - Full Stack Developer and Database Administrator</ins>
  * Responsible for handling development tasks (both frontend and backend) 
  * Responsible for setting up and maintaining the database 
  * **Strengths:** Experience with backend development (Java, C#), API development (Flask, Spring Boot), and databases (SQL)
  * **Weaknesses:** Lack of experience with React Native and no experience with MP3 libraries and CircleCI
* <ins>Tony Yi - Full Stack Developer</ins>
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Experience with Python, frontend development (ReactJS), and transcoding audio/video files
  * **Weaknesses:** Unfamiliar with testing an asynchronous frontend, iOS and React Native combination, and CI/CD tools
* <ins>Philippe Yu - Full Stack Developer</ins>
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Fluent in French, experience with app development (iOS and Android), and experience with cloud solutions (AWS)
  * **Weaknesses:** Lack of experience with CI tools, unfamiliar with React Native and API design patterns

#### Q7: What operational events will you have as a team?

We will have a meeting with the partner every Friday at 1PM. The purpose of these meetings is so that the partner can receive weekly updates, as well as so we can all discuss ideas and address any concerns about the project. Additionally, in situations where the partner is unsure about a question we ask, we can give them some time to think about it and discuss with other members of their organization about what would work best for them. We will also have a team meeting after our partner meeting to recap and decide on our steps forward. We will discuss the progress of all features currently being implemented and decide on whether we want to assign new tasks from the backlog. This will also be a time for us to conduct code reviews and address any questions a team member might have. As different team members might be assigned to tasks together, it is up to them to find time with their partner(s) for coding sessions and meetings regarding their specific feature. 

<ins>Meeting Minutes: Partner Meeting #1</ins><br>
> October 9, 2020 at 12:00pm

During our first meeting with the project partner, we wanted to establish what the general user flow would look like and the scope of the project. The core of our conversation revolved around how we would be structuring the audio and text responses. This is something that our project partner had not thought about in much detail, so we took this opportunity to brainstorm ideas with her and discuss which elements were critical to functionality. In the end, the consensus was that the partner envisioned simply uploading independent recordings with tags, but direct responses would be very nice to support. As such, we will explore supporting a Twitter-like response structure, but we may first implement simple independent story uploads to demonstrate core functionality within the first iterations of the application. Another topic we discussed in depth was employee vetting of responses. To ensure that no harmful content is uploaded, the partner wishes for every story response to be vetted and approved by an employee. This means that we will need an interface for this employee to see proposed content. This then brought us to the topic of user profiles. If we supported user profiles, then we could simply have elevated permissions for employees to review material, but the partner established that other features that user profiles may bring such as a profile view for seeing all content posted by a user would not be necessary. If we decide not to support profiles, then the alternative vetting procedure would be to have a completely separate portal for employees. In general, with this meeting we established the bare minimum features that the partner wishes the application to have, and the scope of the project beyond those requirements is within our hands.  The partner is now working to get us access to more technical information, which no doubt will cause us to rethink aspects of our architecture and project scope.

<ins>Meeting Minutes: Partner Meeting #2</ins><br>
> October 16, 2020 at 1:00pm

During our second meeting with the partner, we discussed the storage solution that we would be using. We discovered that Storytellers is currently in the process of migrating their existing storage into a more robust cloud solution. We discussed potential providers and estimated the monthly cost of hosting their existing storage, as well as estimating what additional cost our application may create. In the end, the partner is currently meeting with the technical department and aims to get back to us at the beginning of the week with more information. With this said, this does not impact our ability to work as we can simply build out the basic functionality and integrate it with their storage solution later down the line as it becomes ready. We also discussed the UI of the application regarding logos, colours, etc. that the partner wants to include within the application. She will provide us with logo graphics to include, and blue seems to be the predominant colour for the company. She trusts our ability to build a sensible UI, but we obviously will show her mock-ups to ensure we have not made egregious mistakes.
  
#### Q8: What artifacts will you use to self-organize?

The main artifact we will use to organize our tasks will be a **GitHub Projects** board. Firstly, we have a list called Resources where we will put our design documents for easy access as well as other notes unrelated to development such as meeting minutes. We will keep track of the development tasks we need to complete by placing them in a backlog and moving them further down our pipeline as work progresses. The categories we have on our GitHub Projects board for development are Backlog, Dev In Progress, Dev Code Review, Dev Testing and Complete. In our GitHub Projects board, we will organize tasks by labels and tags, with the most important tasks being labelled critical. In order to assign tasks to team members, we will engage in frequent team meetings so we can go over what is required and who on the team is best suited to handle it. This means that we will collectively distribute tasks based on the skill sets and workloads of team members. We will determine the status of work by which stage the task is in the GitHub Projects board, where we will only say a task is complete once it has been thoroughly tested and reviewed. Our code review process will be conducted by at least 2 group members different from the person submitting the code, who will determine whether or not the code’s style is good enough for the task to move forward in the pipeline.

This document will also be a very important artifact for us to look back at as it clearly documents what we plan to deliver to our partner, along with how we plan on doing it. If a team member has any questions regarding project deliverables and designs, this document will be a good place to check. Other artifacts we will use include a weekly schedule for meetings with our partner as well as meeting minutes which are neatly written up and put on the GitHub Projects board.


#### Q9: What are the rules regarding how your team works?

As everyone in the group already knew each other before starting this project, we believe we will have a great environment for being productive and open with one another.

We expect to have scheduled Zoom meetings with our team several times a week. We have currently scheduled a meeting with our partner every Friday afternoon so we will also have a call after each one of those meetings to recap and decide on the steps forward. We also have a Facebook Messenger group which we use to send quick updates or questions. This Facebook group allows us to maintain constant communication throughout the week to coordinate efforts. We also have a GitHub Projects Board where we assign tasks. 

Communicating with our partner is critical to the success of this project, and as such we aim to maintain consistent communication through both email and Zoom. We have a weekly meeting scheduled for 1pm every Friday, and we also communicate through email in order to address any concerns or updates throughout the week. With this structure, we are able to have an up to date view of the rapidly changing components of our project and provide in depth progress updates and request constant feedback.

Meeting attendance is assumed to be mandatory and we will keep track of attendance to determine if individuals are not participating. To ensure that action items are completed, we have the GitHub Projects Board to keep us up to date and ensure that we have not fallen behind on certain assigned tasks. Our Scrum Master will serve as a moderator and notify the group if we need to address an issue with completing items on the GitHub Projects board. 
 
**Conflict Resolution:**

Below we have outlined 3 scenarios of hypothetical conflict within the team, and the methods we would take to resolve this conflict. 

<ins>Team members are split on how to implement a feature:</ins><br>
We will first list out all the potential options that a team member has suggested for implementing the feature. Once we have that list, we will discuss our thoughts regarding why we think one solution might be better than the others. Once we have given our arguments, the team members closest to the feature will take a vote and the implementation with a majority will be selected. Other team members will join in on the vote if they feel qualified to do so regarding the technology in question.

<ins>Non-responsive team members:</ins><br>
As we have each other's contact information, we will try and contact them through several channels. We have decided that 3 days of no contact from a team member who the others have tried to reach will be our limit before we contact our TA. If we are aware that a team member is extremely sick or unable to do work for whatever reason, we will do our best to avoid contacting them regarding the project until they are available again.

<ins>Work from other classes is affecting a team member's productivity:</ins><br>
We are all open with eachother and if one person feels stressed because of another course's workload, it is our duty to help out and divide work to try and minimize everyone's stress as best as possible. All larger tasks will have more than 1 person assigned so it will up to them to coordinate and find a solution but if more help is required, we will all try to pitch in where we can. If we are all feeling overwhelmed, our first step will be to try and find a solution before reaching out to our TA and seeing if an extension is possible.

----
### Highlights

During this planning phase, we made a few very critical decisions that we want to emphasize below. 

**Choosing to Use User Profiles**<br>
A key decision that we made was to construct the app around the support of user profiles.  The primary reason that we decided to support user profiles was in order to provide an easy way to support elevated permissions for employees. Every story that gets posted on the platform needs to be vetted by Storytellers of Canada volunteers prior to being made public, and so we figured the easiest way to implement such functionality would be to have admin user permissions enabling the employees to review pending posts and approve or deny them. The alternative without these user permissions would be to have a separate employee portal, but we decided that creating a separate portal would be inefficient, costing us more time and requiring large amounts of duplicated code.  User profiles also allow us to gain a further level of content filtration in the form of blocking users, enabling employees to not only disapprove of content but also block users entirely. We also gain a huge amount of flexibility regarding more advanced features in the future. For example, though for our MVP the partner has established that features such as profile view, viewing all stories posted by a user etc. would not be required, by supporting basic user profiles we provide the modularity required to build out these more advanced features in the future if so desired. Another aspect that we considered was in regards to interactions between users. Supporting user profiles adds a level of personable communication between members that would not exist if we did not attribute comments to users. Since the core mission of this application is to drive interaction and sharing of experiences between people, increasing levels of interaction between users by any means is an extremely desirable outcome. Another simple but important factor to note is that we believe supporting user profiles will not substantially increase the amount of development time involved with the application. Though it requires creating sign up and sign in functionality, we believe that this will be simple to implement, as we have done so before, and that the benefits of supporting user profiles more than offset the added development time.

**Choosing to Use a Tree Structure for Recordings**<br>
One of the most important decisions that we deliberated over was the structure of our comments and story responses. As the story response feature is the core component of our application, this was not an easy decision to make and required evaluating numerous factors and cost benefit analysis. We debated on 3 methods of structuring our responses. The first was the most simple, eliminating the concept of a story response and instead requiring the user to upload every story as an independent post, with no visual connection to the story that inspired it. This structure is what the partner originally proposed trying to minimize the amount of work our team would have to do, but after extensive deliberation during the first meeting we came to the conclusion that this was the bare minimum, and that we were not satisfied with the poor levels of interaction that this structure would provide. The second approach we considered was to adopt a response structure that allowed for users to provide story responses and comments to the header story, but restricted further branching structure by disabling commenting and responding to previous comments and responses. This structure would give us a deeper level of interaction between users as desired, but still does not provide quite the full level of nesting interaction that most social media apps provide. The reason for this compromise would be to make the UI easier to construct. The third option is to support a full unrestricted tree structure of responses, as seen in typical social media apps such as Twitter. This structure maximizes user interaction and is the most familiar to users as it matches the structure of other popular applications. With this said, this is the most complex to implement and poses the greatest UI challenge. In the end, we have decided that we want to support this full unrestricted tree structure. We believe that though simple, we would not be satisfied providing the first option as a deployed product, and we believe that the added development time needed to support the third option compared to the second option is not enough to make the compromised experience worth it. After further research into the viability of producing such a structure in a short period of time, we found that there are numerous resources available to assist us in this task as it is such a common structure in social media applications. As such, we have come to the conclusion that ambitiously pursuing such a structure is perfectly doable within our timeframe. Once we decided on this structure, we further debated how we wanted to design the UI. We debated between a Reddit-like UI with indentation indicating responses, or a Twitter-like UI requiring you to select the comment, bringing you to a separate view with this comment as the focus and responses to it displayed below. Due to the large card view nature of our recording responses, we decided that taking the Twitter approach would provide a much cleaner visual experience, and we would not have to worry about overflowing indentation space.
 
 **Choosing Python as our Backend Technology**<br>
For the backend of our application, we considered using Python (Flask), Java (Spring) and JavaScript (node.js and Express). We ended up choosing Python and Flask based on the following considerations:
* The language that the team felt most comfortable with was Python given past experience so we felt that choosing a language everyone knew would allow us to troubleshoot together and prevent a programming language barrier. Although we all had experience with Java as well, several team members had used both Flask and Spring Boot before and believed that Flask was easier to use.
* We considered all three to be mature as they are widely accepted and recognized to be exceptional languages by developers from all around the world, so this was not a major factor. When looking at industry technologies, we know Python has been used to build large solutions so we would have no issues with scalability for the purposes of our app
* All three languages are heavily used by a large user base so we knew we would not have a problem with finding online support and documentation for any issues we might have with using Flask.

**Choosing React Native as our Frontend Technology**<br>
For our frontend mobile technology, we were deciding between React Native, Java, Swift, and Kotlin. We ended up choosing to use React Native based on the following considerations:
* React Native’s versatility in many domains is perhaps its greatest strength, and this point had the most impact on our decision to use it for our project. Java can only be used for building Android apps, and Swift can only be used for building iOS apps. React Native is able to be used on both Android and iOS, without modifying the code base at all (which is required in Kotlin, for example). Additionally, with some additional packages, React Native can run on the web with no modifications, making it by far the most versatile of all our options.
* Many of our team members have used ReactJS, JavaScript, or React Native in the past, so we concluded that it would be the best choice for us to get straight to building our project, without too much of a learning curve. Additionally, React Native has been hailed as one of the best choices for creating beautiful UIs.
* Traditionally, Java and Objective C / Swift were the standard technologies for building apps and were the most popular. In the recent years, however, React Native has gained a lot of traction, particularly among start ups and smaller companies who need a quick way to deploy their codebase to multiple platforms. Due to the recent popularity of React Native, there is lots of support online, and many prebuilt components which are open source.
