# Momentum Development Notes

## Authentication Decisions
- **Custom Branded Auth Pages**: Deferred to a later milestone. We are currently utilizing Clerk's default hosted account sign-in/sign-up components and redirect configurations to keep authentication setups lean during Phase 0/1.
- **Profile Synchronization**: Running standard fallback server actions (`ensureProfile()`) in the root layout to sync Clerk profiles directly into Supabase during local development, circumventing the need for public ngrok webhook tunnels.

## Fitness Tracking & Bodyweight Log Considerations
- **Bodyweight vs. Weighted Workouts**: Certain exercises (like pushups) do not require weight inputs for progression tracking since the user's body weight is the primary load. For these bodyweight exercises, tracking reps and sets is sufficient.
- **Initial Body Weight Input**: Integrate a general bodyweight input system (such as in the Wellness Log/Profile) that can be referenced for bodyweight exercises, rather than prompting the user for weight on every bodyweight set.

## Momentum notes:
- Estimated test time: 8:23 am - 1:00 pm. 5th June, 2026
- Take ur time in analyzing this note. It is detailed and thought out, like reading a person's mind.
- It has a rundown of my observations while testing Momentum.

## 1. Habits page
- I didn't know i could log habits for past days. It felt good that I could log habits if i forgot
- Haven't understood the "Context tags" yet. I guess it means I can log the time when i made the note if I wanted to.
- I noticed 'initially' that if I added a daily log note as extra detail in a habit that I logged for thursday, If i switched to a different day, the log transferred to that day too. But this only happened cos thursday's daily habit log had the daily log note attached and the others didn't.

**Let me try adding log notes for the past completed 'drink water' habits:**
- oh, just noticed that after switching category from all to a different category like growth or health or fitness, the daily log note from thursday disappeared, along with the 1 star difficulty I gave the habit that day.

**let me try adding it again:**
- Noticed that clicking on save details after adding "log notes, 1 star rating, and 2 context tags" didn't declared the habit as completed for the day. I had to click on 'mark as completed' for it to, well, be complete. I think that's a good feature.
- I dunno yet if this logs disappear after I switch categories or persist for days without logs (Also, the 'save details' button shouldn't be clickable if no changes were made to the logs, i.e., the log stay the same, the button stays unclickable till the state of the logs contents change.)

**I'll check that now:**
- if no log details have been added, the 'edit logs' area displays as 'Log notes, difficulty & context', and after log details have been added and saved it displays as 'edit log details'. that's good, the states of the different days don't affect each other. but clicking on an 'log notes, difficulty...' the data from the thursday i added logs for display on that day too, but so far, i haven't saved on that day (Wednesday). let me add different data for Wednesday and see if the state of Thursday changes:
- It did change the details for Thursday, that's terrible. Initially, thursday had 1 star, 2 context tags "morning and home", and a unique log note. but after I added logs for wednesday (2 stars, night and work context tags, and its note) and it changed thursday's logs and wednesday's logs became persistent across days. both days had 'edit log details' on and not the empty logs 'log notes, difficulty...'. bad

**I'll look at how the ui/ux of the habits page behaves with all the activities:**
- So If I select logging date, say thursday, if thursday is completed, that day i marked complete in the feature tabs above that display 'daily adherence, today's progress', the total active habit remains 1 because the 'drink water' habit is what's active atm. (I'm sure the log persistence and clearing will affect multiple habits). If I click a day that wasn't marked complete, the feature tabs say 'today's progress: 0/1, daily adherence: 0%', but habit tracked/active is 1 (drink water habit).
- For completed days, progress and daily adherence says 1/1 and 100%. I dunno how that daily adherence is calculated; is it adherence for multiple days or just one day? Overall, the feature tabs in the habits page should be a page metrics system/display that adjusts and tells u stuff from all the completed/non-completed days, and not just display data for only the selected day. or is that against the app logic? because that day was selected and the tabs are displaying that days data.
Hmmm... "question mark" there.

**Conclusions on habits page:**
- Basically, whatever log details are saved become the placeholder for other days, but i haven't checked if it happened for days not marked complete. (Note: if changes are made to log details (rating, context tags, and log notes), or log details are added, that day becomes incomplete, i.e., the 'Completed today button' turns back to 'Mark Complete' (grey).)
- Yes, the placeholder log details from saved logs persist for completed and not-completed days. bad
- switching categories, and/or changing from active to archived habits clears the logged details. So the logged details (context tags, rating and log notes) all disappear if the current view/state is changed. bad
- The days stay marked as completed but the daily logs in the daily habit do not persist, and also are not unique to one day--one days details affect that of another day. bad
- The feature tabs in the habits page (that show daily progress, adherence, and active habits) need some explaining on the logic behind them

**I'll go ahead and test other features**

## 2. Dashboard
- The "drink water" habit is active in the dashboard
- I'll dive into the fitness page next. this part has lots of parts I haven't tested yet

**I'll return to the Dashboard later after testing the rest of the app**

**I have returned (This should probably be at the bottom, so yeah):** The final comments on the dashboard is at the latter stages of this note. 

## 3. Fitness
- current status: 0 workouts
- i'll start with an empty workout session.

**Session started**
- counter reading
- tried to add walking lunges, saw weight--im guessing that's the weight of the dumbbells or equipment i used. Does my body weight count? probably not. I log in 5kg dumbbells, that's 10 total, 10 reps.
- I don't get what RPE means, and why it ranges from 1-10.
- Clicked on 'check' and saw a 90 secs timer, with options to add or remove 30 secs
- Added another set of walking lunges. lets say that's 1 on each foot. Damn, I haven't done walking lunges before. uhhh...Lets say that's 15 on each foot, yeah. I know forward lunges, I guess with walking lunges u either walk and lunge or do one foot-one rep.
- Clicked on hanging leg raise. still asked for weight. has me thinking that not all exercise require weights (of course that's normal), and also that some could just be endurance exercises where u have to maintain a specific position. I don't see any time logs in the exercise sets, just weight, reps, and RPE. i guess I'll delete the hanging leg raises, and try a different set
- Saw the bodyweight squats. hmmm... do I add my body weight as the weight, cos that seems logical, but how will the system interpret that? i'm seeing some UX issues in this fitness section. Are there ways of knowing hpow much an individual squat rep is?... Let's try a different exercise
- Pushups and those bodyweight workouts have me thinking of the weights before I actually try them, and i'm not familiar with all workouts and what is involved in them.

**Okay. i did a little research and found some push and pull exercises I could do with the 5kg(x2) dumbbells, like the walking lunges:**
- Dumbbell Bicep Curls: 3 sets, 10kg, 10-8 reps, RPE still RPE
- Barbell Bench Press: 4 sets, 10-6 reps, 10kg, RPE
- I logged in 4 sets of one more workout, but after I clicked 'finish workout', I was shown the fitness page with the presets, but at the base where the session i just completed was supposed to show, I saw nothing. So i dunno the exact 4th workout I "did". terminal logs shopws that something happened when I clicked 'finish workout' but i haven't seen it from my current location (the fitness page after I clicked "finish workout").
```terminal
POST /fitness 200 in 4.4s (next.js: 7ms, proxy.ts: 33ms, application-code: 4.4s)
  └─ ƒ saveWorkout({"date":"2026-06-05","duration":34,"exercises":["[Object]","[Object]","[Object]"],"...":"2 items not stringified"}) in 1334ms app/actions/fitness-actions.ts
```
- Okay. I went to dashboard and saw the workout I just did. Total volume 1220kg... that's sick! and I went back to the fitness page and saw the workout there too. I didn't give it a name, so it's saved as 'Empty Workout'
        - Time: 34 mins (the time i spent making up the session)
        - Total volume: 1,220 kg
        - clicked the workout, a dropdown button inverted (but the whole tab session iss clickable), saw the note i added (it was in a tab in italics)
        - Okay, finally saw the 4th workout (actually the 3rd workout in that session): Incline Dumbbell Bench Press: 10-7 reps, 4 sets, 10kg
- I don't see an edit button tho. I guess good? but if I missed a workout, rep, the RPE that I still don't understand, I should be able to add it. Initially I though I could just log in a missed workout as a new session, but I think adding RPE and then adding reps or missed workout are good reasons to have an edit button, no?

**Now, I'll test the preset workouts**
- I haven't yet, but the weight complication i observed in the 'start empty session' will kinda frustrate me if a go into the presets, cos workouts have different focuses and things to log (we both know that), so let's not dive into that situation again.

**Conclusions after Fitness**
- The overall ui/ux of the app is smooth, easy to use, some complications but i'll identify them. I like the green accents, fire icons that pulses in the habits page...
- current status: 1 workout
- major complication is the weight and way workouts are logged. of course diving into it and trying to have the system adapt to different workout log methods, and things to log in general will have it'sown complications. But we still need to create a solution
- The RPE thing, still don't get it. Finally looked it up, and I wish I did earlier. It's a good feature--being able to log how I feel after a workout--more reason why the workouts should have an edit button. But that brings it's own complication: will the timer resume? cos the total volume will probably increase after some changes have been made to the session

**On to wellness**

## 4. Wellness
- Wrote a daily reflection (not saved yet):
```📝 Free Writing
I'm pretty surprised at how detailed my Momentum Wellness tracker is.
I was subconsciously holding off on testing probably because of the fitness tracker. Not the doing-a-workout aspect of it, rather the complexity in logging weights in a workout session. I wanted to do planks, weight was there, but I don't do planks with dumbbells. Do I log my weight instead? But what about the reps? How do I handle that? Planks is a test of endurance and I didn't see a timer in the workout, but there is a timer for the session in general.
That whole thing led me to stick to only push and pull workouts during my testing today, and I avoided testing the preset workouts "templates" (Preset Workout Templates is too long, no? Preset Workout kinda sells the whole thing).
Anyways, i'm still testing. currently in the wellness page of the app, and RPE is a good feature in the Fitness page (just learnt about it).
```
- The daily reflection emojis make it hard to know what each emoji meant, but i guess if u use the app for long, u'll get used to it? but that's bad ux, cos the user should know what it means immediately they see it. Hmm... adding the emoji along with the text in the tab will explain it immediately, but is bad ui. while the current state (with the emojis under the header text in mobile, and at the right side in desktop (wider screens)) is good. I guess since they display clearly in the input field (with the text and icon), u'll know as soon as u click on of them. But some ux issues might still linger.
- mood: good, energy level: balanced, sleep: 7 hrs, sleep quality: 3 stars
little wellness guide at the bottom in mobile, and by the side in desktop. good
- Checked 'history & stats'--This app looks good, btw. it shows awesomeness in small places
        - Avg sleep duration: 7hrs
        - Avg mood rating: 4/5
        - Avg energy score: 3/5
        - History Logs (1):
            - Fri, Jun 5
            - 🙂 Good
            - ⚡ 3
            - 🌙 7.0h (Quality: 3★)
            - {My "Free Writing" note here in italics}
- Saw an 'Edit' and delete button, but on clicking the delete button, I got a browser modal/confirmation message (I think that's what it's called) to confirm deletion. that's not ideal for the app. I think it'll be better if the page ui had it's own cool 'confirm deletion' message/pop-up/modal/dialog box that feels like part of the app, instead of the site overlaying with it's own modal (I hope I'm using the terms correctly). it'll be good if every modal was part of the ui instead the browser's modal overlaying the page ui

**On to Progress**

## 5. Progress

- **Habit & consistency:**
        - Hmm. Mobile ui first impression, bad.
        - The habit heatmap and adherence trend require horizontal scrolling, which is not present and is also not allowed according to the **UI/UX_BRIEF.md** document, if I'm correct. So it's a slippery slope.
            - A good fix would be making the map and trend graph adapt to fit the screen, but not squish together. For instance, if the normal trend view is 10 weeks, and requires scrolling, the fix will make it be able to display 5-10 weeks depending on the size of the screen. Similar fix for the github style heatmap. Instead of a 30-day view, it's just 15-30 days depending on the screen.
            **OR**
            - Make the heatmap and graph horizontally scrollable.
            There are other options but these are what I can think of rn. Don't propose fixes limited to these two. u can modify them, but i'm open to other ideas
        - Saw 4 green boxes on the heatmap: I'm guessing if more habits are involved and maybe incomplete, there will be variations in the green colors
        - saw a spike in the adherence trend graph on "Wk -0": I'm guessing that's this first week of June?
        - I need some explanation/clarity on how the adherence trend graph works--dope ui btw.
        - in the little floating thing that follows the cursor around on the heatmap, it's behavior is weird and different (inferior) compared to all the graphs: when hovered or cursor-followed, the floating thing, especially because of the 4 days at the far right of the map, that floating thing extends to the right and causes the map container to pop out a horizontal scrollbar and extend the vertical scrollbar. (I'll add an image u can view). This only happens with the entries at the far-right 2-3 columns and not to any other colums. The floating thing does not shift to the left of the map, but instead remains stagnant, forcing the scrollbars to appear.
        ["/home/redmane/Pictures/Screenshots/Screenshot From 2026-06-05 12-24-00.png", "/home/redmane/Pictures/Screenshots/Screenshot From 2026-06-05 12-23-38.png", "/home/redmane/Pictures/Screenshots/Screenshot From 2026-06-05 12-23-19.png", "/home/redmane/Pictures/Screenshots/Screenshot From 2026-06-05 12-30-27.png"]
        - If u observe the positions of the vetical and horizontal (in the heatmap) scrollbars, the location of the floating thing, the half appearing floating thing (I'm sure u get what I mean by floating thing), u'll se what I'm talikng about.
        - The floating things in the graphs are adaptive, the one in the heatmap isn't. That's what I mean.
- **Fitness and PRs:**
        - Saw the blue 1220 kg bar on Jun 5
        - oh! saw the exercise progress graph. nice. I'm guessing there will be a curve or something when i log in more exercises
        - Saw Personal Records (so that's what PRs mean).
        - Saw est. 1RM: 13.3 kg I'm guessing that's the average reps, per minute?
- **Wellness Insights**:
        - Wellness Correlations graph: more data, more grph-like look
- **Body Composition:**
        - Body weight and musle mass trend graph: empty. I dunno how I'm gonna measure muscle mass.
        - No measurement history yet. I didn't know I could log that. Most data in this progress page are from the previous pages, but this body measurements is the last tab in the last page. I sense assessibility issues maybe, but it's not that bad
        - body metrics: I only know my weight, and it's an estimate.
        - weight: ~63.67 kg
        - Notes & Observations:
```txt
        Haven't eaten today. This weight measurement is an estimate based on my look on the mirror, my 189 cm height, and my my chats with friends and chatbots
```
        - Logged in my body weight, saw a little dot on the graph.
        
## 6. Dashboard (continued)
- I revisited the dashboard after my observation of the rest of the app, and in comparison the how detailed the rest of the app is, fitness, wellness, progress and all that, the dashboard is somewhat scanty.
- I felt, should I say disappointed when I went back to it and just saw habits, fitness and wellness tabs.
- But again, should it be that complex at this Phase we are in? Probably not, so I guess put a pin on the dashboard thoughts. we'll work on it later.
- it should probably have a tab for body composition / measurements, so I dont have to scroll to the last bus stop to access it add data
- But again, it seems like it's good in that last tab, last page, cos weight can't change rapidly within a day, so u'll probably visit it one a week or so wehn u are checking ur progress. that seems like a good situation for someone like me who isn't close to a scale anyway
- But again, seeing it in the dashboard could incentivize me to go get a scale and get a measurement.
- Tobsy turby or whatever that phrase is. Maybe the dashboard will be the cherry on top when we are done building.

## Conclusion from observations.
- The app looks well-detailed and I'm glad we have progressed well in phase 2. 
- I'm sure I covered a lot in this note, and the things and flaws I observed need well-thought out responses and solutions 
- I'll advice u to take your time in analyzing all I've said in this notes. i don't want u missing anything, cos I don't think I missed anything.
- Finally, these notes and the issues I found out have roots in different areas of the app, obviously. so we can't charge in with a fix from the jump without thinking it through. It'll be piece by piece, similar to how the app is being built.
- If I keep going, I'll end up repeating and reiterating, so that's all for now.
**Do a good job**

## 404 Page (Upcoming)
- Build a weird and awesome custom 404 page. Must feel engaging, gamified, or unexpected. Grill user on design later.

## Settings & Dashboard Personalization (Upcoming)
- Plan and design a personalized Settings system.
- Allow the user to customize their dashboard by adding or removing individual widgets (e.g., body composition/weight log widget, goals tracker, fitness status, wellness log).
- Start implementing this customization layout directly on the dashboard first, eventually syncing settings with the user preferences database table.

## Clerk Authentication Customization (Low Priority)
- Customize the auth page UI to match the Momentum design system.
- Currently, Clerk uses grey and subtle orange accents, casting a white translucent, opaque overlay over the page.
- Make the overlay less translucent to match Momentum's dark, premium glassmorphism.

