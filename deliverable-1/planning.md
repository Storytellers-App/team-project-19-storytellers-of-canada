# Team Storytellers of Canada
> _Note:_ This document is meant to evolve throughout the planning phase of your project.   That is, it makes sense for you commit regularly to this file while working on the project (especially edits/additions/deletions to the _Highlights_ section). Most importantly, it is a reflection of all the planning you work you've done in the first iteration. 
 > **This document will serve as a master plan between your team, your partner and your TA.**

## Product Details
 
#### Q1: What are you planning to build?

 > Short (1 - 2 min' read)
 * Start with a single sentence, high-level description of the product.
 * Be clear - Describe the problem you are solving in simple terms.
 * Be concrete. For example:
    * What are you planning to build? Is it a website, mobile app,
   browser extension, command-line app, etc.?      
    * When describing the problem/need, give concrete examples of common use cases.
    * Assume your the reader knows nothing about the problem domain and provide the necessary context. 
 * Focus on *what* your product does, and avoid discussing *how* you're going to implement it.      
   For example: This is not the time or the place to talk about which programming language and/or framework you are planning to use.
 * **Feel free (and very much encouraged) to include useful diagrams, mock-ups and/or links**.

We are planning to build a mobile app that allows storytellers and listeners to share their own stories, respond to other stories with their own story, and listen to the Storytellers of Canada radio station. The stories that users can submit will be voice recordings of up to 3 minutes of length.  

StoryTellers of Canada (SS-CC) is a group of storytellers devoted to connecting people, reflecting culture, and inspiring discovery through the art of storytelling. Their biggest problem is that they have a radio set-up but lack listeners. Their organizational and artist goals include making connections through story, but connections require interactive opportunities. Storytellers of Canada need a platform that allows users to interact with each other and that is what we aim to create.

<ins>Example Use Case:</ins><br>
A storyteller or listener listens to the Storytellers Radio station, but feels disconnected because they cannot share their own story. Therefore, they simply stop listening. Our app will allow for more interactiveness as they are now able to share their own words, which will hopefully retain listeners and attract new storytellers. 

<ins>What Exactly Our Product Will Do:</ins><br>
Firstly, our app will allow users to create a personal profile. The user can then listen to the SC-Radio-CC’s radio station OnDemand, a stored story collection told by professional storytellers, and stories posted by other users of the app. The stories posted by users are recordings of up to 3 minutes in length and the stories in the stored collection are up to 30 minutes. Users can also search for tags; for example, a user can search for “summer” and a list of stories with the tag “summer” will appear. Next, users will be able to record their own story on the app and post it for everyone to listen. In addition, users can reply to other users’ story by simply clicking a reply icon and recording their response story. Every user will be able to see all the replies as well, similar to twitter.

<ins>Mockup:</ins><br>
[Mockup of our application on Figma](https://www.figma.com/file/x3QOGBEvcRuAzABjS5dh8Y/Storytellers?node-id=0%3A1)


#### Q2: Who are your target users?

  > Short (1 - 2 min' read max)
 * Be specific (e.g. a 'a third-year university student studying Computer Science' and not 'a student')
 * **Feel free (but not obligated) to use personas.         
   You can create your personas as part of this Markdown file, or add a link to an external site (for example, [Xtensio](https://xtensio.com/user-persona/)).**

Our target users are French and English speaking Canadians wanting to listen to interesting stories and/or share their own experiences. Firstly we aim to target the current listeners of the Storytellers of Canada radio station, transitioning them to become not only consumers of stories but also producers of stories. We then want to extend this target net to attract a wider range of Candians, creating a network of shared knowledge and stories from people of all ages and backgrounds.  Another specific group to target would be members of the Canadian storytelling community, both those who already have a relationship with Storytellers of Canada  as well as those who currently have no presence on the platform. By targeting these members, we would be attracting talented storytellers, enriching the content on our new platform and driving further interaction with the application.  

#### Q3: Why would your users choose your product? What are they using today to solve their problem/need?

> Short (1 - 2 min' read max)
 * We want you to "connect the dots" for us - Why does your product (as described in your answer to Q1) fits the needs of your users (as described in your answer to Q2)?
 * Explain the benefits of your product explicitly & clearly. For example:
    * Save users time (how much?)
    * Allow users to discover new information (which information? And, why couldn't they discover it before?)
    * Provide users with more accurate and/or informative data (what kind of data? Why is it useful to them?)
    * Does this application exist in another form? If so, how does your differ and provide value to the users?
    * How does this align with your partner's organization's values/mission/mandate?

Storytellers of Canada currently only has a website wherein people can stream their radio station. We aim to transform this by providing a dedicated web app, and mobile apps as well. We believe that the increased amount of mediums in which this radio station can be accessed through will increase the number of listeners.

Engagement is a central priority for this app. Previously, there was no way at all to submit user stories, though manually emailing them to a member of their organization may work. With our app, users can comment on an existing story with their own 3 minute story, which would be vetted and approved by a volunteer. These stories could also receive comments as well, increasing engagement.

Our app also allows metadata to be added and read, including tags, a short description (theme), and physical location. This would allow users to see similar stories, and to search existing stories.

#### Q4: How will you build it?

> Short (1-2 min' read max)
 * What is the technology stack? Specify any and all languages, frameworks, libraries, PaaS products or tools. 
 * How will you deploy the application?
 * Describe the architecture - what are the high level components or patterns you will use? Diagrams are useful here. 
 * Will you be using third party applications or APIs? If so, what are they?
 * What is your testing strategy?

<ins>Tech Stack and Deployment:</ins><br>
Our mobile app and website will all be developed using React Native. We will develop our backend using Flask, which will be run on an EC2 instance on Amazon Web Services. The database will also be run on AWS using their RDS service. The stories that the users will upload will be stored on S3. The stories that we will be provided by the partner will be hosted either on S3, or their own service, that is unclear at the moment. We will deploy the mobile apps using Google Play and the Apple App Store. The website will be hosted on the EC2 instance running the backend. We are using two different repositories, one for the Backend and the other for the react app/website.

<ins>Architecture:</ins><br>
Our high level architecture and components can be seen in the UML diagram below:<br>
![UML Diagram](https://github.com/csc301-fall-2020/team-project-19-storytellers-of-canada/blob/master/deliverable-1/UML.jpg)
This high level architecture outlines a very simplistic model that we can utilize to create our first MVP. With this said, this architecture is modular enough for us to easily expand upon it to add additional functionality such as text comments

<ins>Third Party Applications/APIs:</ins><br>
We may have to use third party applications/apis depending on where the partner has stored the story save collection that we are supposed to access. This is unclear at this point in time.

<ins>Testing Strategy:</ins><br>
We will utilize CircleCI if possible (due to lack of credits) to build an automated testing CICD pipeline. We will create thorough unit tests for our backend and frontend where applicable which run upon pull request into our staging branch. We plan to have a continuous delivery system, where we run integration and UI tests as well as end to end user testing prior to deployment to production to ensure that we only deploy quality code to production.


#### Q5: What are the user stories that make up the MVP?

 * At least 5 user stories concerning the main features of the application - note that this can broken down further
 * You must follow proper user story format (as taught in lecture) ```As a <user of the app>, I want to <do something in the app> in order to <accomplish some goal>```
 * If you have a partner, these must be reviewed and accepted by them
 * The user stories should be written in Github and each one must have clear acceptance criteria.
 
As a user, I want to create an account in order to start posting my own stories<br>
* **Acceptance Criteria:** The user is prompted to create a username and password, the account is created and the user will be prompted to login.

As a user, I want to access the Storytellers of Canada radio station in order to listen to the station<br>
* **Acceptance Criteria:** The radio station link is available on the home page and once clicked will play through the device's audio with options to play/pause.

As a user, I want to record my story and submit it for review in order to share my story to the other users
* **Acceptance Criteria:** Once a user clicks the button to add a story, a recording button is displayed which when clicked, will display an icon indicating that the   device is recording. Once the user clicks stop or the time limit is reached, buttons for play/pause and re-recording will display along with a submit option. When the submit button is clicked, a popup will show telling the user that their submission is under review.

As an admin, I want to review and approve submitted stories in order to have the stories published on the app or rejected and deleted<br>
* **Acceptance Criteria:** A tab is displayed that allows admins to review submitted stories that each have play/pause buttons along with options to accept/reject. If approved, the story is published to all users and is marked as approved in the user's account whereas if rejected, the story is deleted and marked as rejected in the user;s account.

As a user, I want to reply to other users’ stories in order to interact with them<br>
* **Acceptance Criteria:** A reply icon is displayed on every story card that when clicked, will follow the acceptance criteria of adding a story as explained above.

----

## Process Details

#### Q6: What are the roles & responsibilities on the team?

Describe the different roles on the team and the responsibilities associated with each role. 
 * Roles should reflect the structure of your team and be appropriate for your project. Not necessarily one role to one team member.

List each team member and:
 * A description of their role(s) and responsibilities including the components they'll work on and non-software related work
 * 3 technical strengths and weaknesses each (e.g. languages, frameworks, libraries, development methodologies, etc.)
 
<ins>Team Members</ins>
* <ins>Priyanshu Arora - Scrum Master and Full Stack Developer</ins>
  * Responsible for organizing and updating the GitHub Projects board
  * Responsible for organizing internal meetings
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Experience with frontend development (ReactJS), Python and API development with Spring Boot
  * **Weaknesses:** No experience with Flask, MP3 libraries and lack of experience with UI design
* <ins>Aidan Brasseur - Product Manager and Full Stack Developer</ins>
  * Responsible for organizing meetings and communications with our partner
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Experience with Python, API development and database management (SQL)
  * **Weaknesses:** Unfamiliar with UI design, React Native and Flask
* <ins>James Currier - Full Stack Developer and Designer</ins>
  * Responsible for handling development tasks (both frontend and backend) 
  * Responsible for initial app mockups and progressive design mockups
  * **Strengths:** Experience with React Native, Python and working with clients to determine designs
  * **Weaknesses:** No experience with Flask, iOS development and CI tools
* <ins>Saeyon Sivakumaran - Full Stack Developer and Database Administrator</ins>
  * Responsible for handling development tasks (both frontend and backend) 
  * Responsible for setting up and maintaining the database 
  * **Strengths:** Experience with backend development (Java, C#), API development (Flask, Spring Boot) and databases (SQL)
  * **Weaknesses:** Lack of experience with React Native and no experience with MP3 libraries and CircleCI
* <ins>Tony Yi - Full Stack Developer</ins>
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Experience with Python, frontend development (ReactJS) and transcoding audio/video files
  * **Weaknesses:** Unfamiliar with testing an asynchronous frontend, iOS and React Native combination and CI/CD tools
* <ins>Philippe Yu - Full Stack Developer</ins>
  * Responsible for handling development tasks (both frontend and backend)
  * **Strengths:** Fluent in French, experience with app development (iOS and Android) and experience with cloud solutions (AWS)
  * **Weaknesses:** Lack of experience with CI tools, unfamiliar with React Native and API design patterns

#### Q7: What operational events will you have as a team?

Describe meetings (and other events) you are planning to have. 
 * When and where? Recurring or ad hoc? In-person or online?
 * What's the purpose of each meeting?
 * Other events could be coding sessions, code reviews, quick weekly sync meeting online, etc.
 * You must have at least 2 meetings with your project partner (if you have one) before D1 is due. Describe them here:
   * What did you discuss during the meetings?
   * What were the outcomes of each meeting?
   * You must provide meeting minutes.
   * You must have a regular meeting schedule established by the second meeting.  

We will have a meeting with the partner every Friday at 1PM. The purpose of these meetings is so that the partner can receive weekly updates, as well as so we can all discuss ideas and address any concerns about the project. Additionally, in situations where the partner is unsure about a question we ask, we can give them some time to think about it and discuss with other members of their organization about what would work best for them. We will also have a team meeting after our partner meeting to recap and decide on our steps forward. We will discuss the progress of all features currently being implemented and decide on whether we want to assign new tasks from the backlog. This will also be a time for us to conduct code reviews and address any questions a team member might have. As different team members might be assigned to tasks together, it is up to them to find time with their partner(s) for coding sessions and meetings regarding their specific feature. 

<ins>Meeting Minutes: Partner Meeting #1</ins><br>
> October 9, 2020 at 12:00pm

During our first meeting with the project partner, we wanted to establish what the general user flow would look like and the scope of the project. The core of our conversation revolved around how we would be structuring the video and text responses. This is something that our project partner had not thought about in much detail, so we took this opportunity to brainstorm ideas with her and discuss which elements were critical to functionality. In the end, the consensus was that the partner envisioned simply uploading independent videos with tags, but direct responses would be very nice to support. As such, we will explore supporting a Twitter-like response structure, but we may first implement simple independent story uploads to demonstrate core functionality within the first iterations of the application. Another topic we discussed in depth was employee vetting of responses. To ensure that no harmful content is uploaded, the partner wishes for every story response to be vetted and approved by an employee. This means that we will need an interface for this employee to see proposed content. This then brought us to the topic of user profiles. If we supported user profiles, then we could simply have elevated permissions for employees to review material, but the partner established that other features that user profiles may bring such as a profile view for seeing all content posted by a user would not be necessary. If we decide not to support profiles, then the alternative vetting procedure would be to have a completely separate portal for employees. In general, with this meeting we established the bare minimum features that the partner wishes the application to have, and the scope of the project beyond those requirements is within our hands.  The partner is now working to get us access to more technical information, which no doubt will cause us to rethink aspects of our architecture and project scope.

<ins>Meeting Minutes: Partner Meeting #2</ins><br>
> October 16, 2020 at 1:00pm

During our second meeting with the partner, we discussed the storage solution that we would be using. We discovered that Storytellers is currently in the process of migrating their existing storage into a more robust cloud solution. We discussed potential providers and estimated the monthly cost of hosting their existing storage, as well as estimating what additional cost our application may create. In the end, the partner is currently meeting with the technical department and aims to get back to us at the beginning of the week with more information. WIth this said, this does not impact our ability to work as we can simply build out the basic functionality and integrate it with their storage solution later down the line as it becomes ready. We also discussed the UI of the application regarding logos, colours, etc that the partner wants to include within the application. She will provide us with logo graphics to include, and blue seems to be the predominant colour for the company. She trusts our ability to build a sensible UI, but we obviously will show her mockups to ensure we haven’t made egregious mistakes.
  
#### Q8: What artifacts will you use to self-organize?

List/describe the artifacts you will produce in order to organize your team.       

 * Artifacts can be To-Do lists, Task boards, schedule(s), meeting minutes, etc.
 * We want to understand:
   * How do you keep track of what needs to get done?
   * How do you prioritize tasks?
   * How do tasks get assigned to team members?
   * How do you determine the status of work from inception to completion?

The main artifact we will use to organize our tasks will be a **GitHub Projects** board. Firstly, we have a list called Design where we will put our design documents for easy access. Secondly, we will have a General list for other notes unrelated to development such as meeting minutes. Finally, we will keep track of the development tasks we need to complete by placing them in a backlog, and moving them further down our pipeline as work progresses. The categories we have on our GitHub Projects board for development are Backlog, Dev In Progress, Dev Code Review, Dev Testing and Complete. In our GitHub Projects board, we will prioritize tasks within lists by sorting our tasks by importance, where the most important task will be at the top. If we need to add more emphasis to a task, we will label the task so team members will know to pay special attention to that task. In order to assign tasks to team members, we will engage in frequent team meetings so we can go over what is required and who on the team is best suited to handle it. This means that we will collectively distribute tasks based on the skill sets and workloads of team members. We will determine the status of work by which stage the task is in the GitHub Projects board, where we will only say a task is complete once it has been thoroughly tested and reviewed. Our code review process will be conducted by 2 random group members different from the person submitting the code, who will determine whether or not the code’s style is good enough for the task to move forward in the pipeline.

This document will also be a very important artifact for us to look back at as it clearly documents what we plan to deliver to our partner, along with how we plan on doing it. If a team member has any questions regarding project deliverables and designs, this document will be a good place to check. Other artifacts we will use include a weekly schedule for meetings with our partner as well as meeting minutes which are neatly written up and put on the GitHub Projects board.

#### Q9: What are the rules regarding how your team works?

Describe your team's working culture.

As everyone in the group already knew each other before starting this project, we believe we will have a great environment for being productive and open with one another.

**Communications:**
 * What is the expected frequency? What methods/channels are appropriate? 
 * If you have a partner project, what is your process (in detail) for communicating with your partner?
 
We expect to have scheduled Zoom meetings several times a week. We have currently scheduled a meeting with our partner every Friday afternoon so we will also have a call after each one of those meetings to recap and decide on the steps forward. We also have a Facebook Messenger group which we use to send quick updates or questions. This Facebook group allows us to maintain constant communication throughout the week to coordinate efforts. We also have a GitHub Projects Board where we assign tasks. 

At the moment we interact through email and Zoom. We have a weekly meeting scheduled for 1pm every Friday, and we also maintain communication through email in order to address any concerns throughout the week. 
 
**Meetings:**
 * How are people held accountable for attending meetings, completing action items? Is there a moderator or process?
 
Meeting attendance is assumed to be mandatory and we will keep track of attendance to determine if individuals are not participating. To ensure that action items are completed, we have the GitHub Projects Board to keep us up to date and ensure that we have not fallen behind on certain assigned tasks. Our Scrum Master will serve as a moderator and notify the group if we need to address an issue with completing items on the GitHub Projects board. 
 
**Conflict Resolution:**
 * List at least three team scenarios/conflicts you discussed in lecture and how you decided you will resolve them. Indecisions? Non-responsive team members? Any other scenarios you can think of?

<ins>Team members are split on how to implement a feature:</ins><br>
We will first list out all the potential options that a team member has suggested for implementing the feature. Once we have that list, we will discuss our thoughts regarding why we think one solution might be better than the others. Once we have given our arguments, the team members closest to the feature will take a vote and the implementation with a majority will be selected. Other team members will join in on the vote if they feel qualified to do so regarding the technology in question.

<ins>Non-responsive team members:</ins><br>
As we have each other's contact information, we will try and contact them through several channels. We have decided that 3 days of no contact from a team member who the others have tried to reach will be our limit before we contact our TA. If we are aware that a team member is extremely sick or unable to do work for whatever reason, we will do our best to avoid contacting them regarding the project until they are available again.

<ins>Work from other classes is affecting a team member's productivity:</ins><br>
We are all open with eachother and if one person feels stressed because of another course's workload, it is our duty to help out and divide work to try and minimize everyone's stress as best as possible. All larger tasks will have more than 1 person assigned so it will up to them to coordinate and find a solution but if more help is required, we will all try to pitch in where we can. If we are all feeling overwhelmed, our first step will be to try and find a solution before reaching out to our TA and seeing if an extension is possible.

----
### Highlights

Specify 3 - 5 key decisions and/or insights that came up during your meetings
and/or collaborative process.

 * Short (5 min' read max)
 * Decisions can be related to the product and/or the team process.
    * Mention which alternatives you were considering.
    * Present the arguments for each alternative.
    * Explain why the option you decided on makes the most sense for your team/product/users.
 * Essentially, we want to understand how (and why) you ended up with your current product and process plan.
 * This section is useful for important information regarding your decision making process that may not necessarily fit in other sections. 
