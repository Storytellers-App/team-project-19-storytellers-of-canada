
# Team Storytellers of Canada


##  Iteration 1 - Review and Retrospect

-   When: **Tuesday November 24th at 1pm**
    
-   Where: **Online through Zoom**


## Process - Reflection

### Decisions that turned out well
One key decision we made was to split the application into user stories (login/register, view public stories, respond to user stories, view stored story collection, post new story, listen to Storytellers of Canada Radio, approve/disapprove stories for admins) and distribute these as tasks to our group members in accordance with individual experience and knowledge. This worked out very well on the front end since each feature has its own screen, therefore merging all separate screens was fast and simple. With the exception of one person, everyone worked on a screen on the front end(this person worked extensively on the backend). The user stories also split backend work into several different backend functions which were created by our most experienced Flask developers in order to get these done as quickly as possible. Because of efficient and consistent communication, we were able to connect the front and back end smoothly.

Another key decision was to have weekly group meetings with our client. This allowed us to get consistent feedback from our client and further discuss implementation needs. In addition, we had a group meeting directly after our client meeting in order to discuss more technical details, which was very advantageous since the meeting takeaways were fresh in our minds. We used this time to update each other on our work and give a plan of action for the following week, which prevented conflicts and delays.

And finally, we decided to use Facebook messenger group as our main source of communication amongst each other. This turned out very well since all of our group members were already familiar with fb messenger and it is easy to share screenshots, make group video calls, and share updates. We chose Zoom as our platform for official meetings with our client; our client was familiar with zoom, which reduced conflicts, and we were able to set up recurring meetings along with email reminders that made it easy for our client to attend. We will continue to use Zoom and Facebook messenger groups as our primary means of communication.


### Decisions that did not turn out as well as we hoped
Although we mentioned that splitting tasks based on user stories was a success, it was also unsuccessful in some aspects. Firstly, we did not take into account the difficulty of the tasks. Therefore, some user stories were implemented very quickly while others were delayed significantly. This caused delays in production and even incompletion in certain tasks that were projected to be completed. Secondly, some screens could have reused certain components of other screens, but since everyone was focused on each individual screen and not thinking of creating general components that could be used elsewhere, we did not take advantage of potential shared resources.

Another decision that was unsuccessful was to have code review approvals before merges into master. This was unsuccessful because group members did not have the time to perform a proper code review, and therefore this caused delays in overall production since certain features needed completed components of other features.

### Planned Changes 
Moving forward, we plan to discuss the possible difficulty of all tasks and distribute them accordingly. This will hopefully avoid delays and allow members to help one another on more complex tasks.

We also plan to no longer have code reviews since they are not benefiting progress; we will trust the expertise of each individual developer.

In addition, we expect to utilize Github projects more rigorously in order to avoid conflicts amongst each other. Github projects will ensure that members have something to work on and there is no single task being handled by multiple members without each other's knowledge. We hope that this will motivate members to take on additional tasks even when they have finished their own.

## Product - Review

### How was your product demo?
To demo our application, we screen shared an android emulator running our application and walked through the entire use case scenario, starting with the registration screen and ending with the nested response page structure. We showed every possible screen and option with this demo to ensure that our partner would have the opportunity to give feedback on any aspect of the product. Our partner was very happy with the features that we presented, enjoying the simplistic styling and the general user interface.

There were very little change requests that did not involve changes which were already planned and were simply cut from this first iteration for time. These cut changes include aspects of the app such as search and notifying users of their approved or denied stories. Of the new suggestions, one was a very interesting note that we had not originally considered: the concept of having a welcoming walkthrough after logging in to the app for the first time. This walkthrough would go through and explain the interface, being accessible by the user at any time if desired. We will certainly work to integrate this walkthrough into our application for the full launch. Another much more simple suggestion included having thumbnails for user stories as well as the stored stories.

From this demo, we were able to discern that we are on the right track in terms of creating a product which satisfies the needs of Storytellers of Canada. We still have a large amount of work remaining to integrate extra functionality, improve the UI, and remove lingering bugs within the application, but from a core perspective, we are nearly there in terms of a completely satisfactory application.

### Planned Product Changes
Though we have implemented the majority of the core functionality of the application. There are several crucial changes that we will be making for the next iteration of the application.

-   **Search:**  
	- Search is the most important functionality that we are currently missing within the app. We intend to allow users to search based on tags, title, etc. on both the StorySave screen and the Home Screen.
    
-   **Story upload with existing audio file:**  
	-   Stories must currently be recorded directly through the app, but we also intend to support uploading your own 3 minute audio files if you have already recorded a story using a different platform.
    
-   **Notifications:**
	-   We intend to notify users when one of their stories has been approved or denied, giving them the option to edit their denied post and resubmit.
    

-   **Profile Improvements:**
	-   We currently do not include profile picture upload within the registration page, or any profile page to access and change profile information.
   
-   **Welcome Setup:**
	-   We need to make an interactive welcome instructional setup for first time users (also accessible at any time for those who have forgotten how the interface works).
    
-   **Post Deletion:**
	-   We intend to allow the user to remove their own posts, and admins to remove any post at any time.
    
-   **Revamped Audio Player:**
	-   The audio player is currently very simplistic in nature, primarily being used as a functional placeholder. It will need an overhaul to support possible thumbnail images, scrubbing, etc. Persistent progress when transitioning from the homepage to the response page will also be a focus.
