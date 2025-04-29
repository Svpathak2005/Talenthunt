# Talenthunt
# Tech Stack - MERN Stack 
# This is a website made for the hacakthon mentoring of the student in this their are three login Admin,Student,Mentor the login are managed using jwt token and the local storage 
# in the student dashboard the studnet have the feature such as the to find the teammate the teammate are shown by fetching the all the student who have registered in the same domain and same category and then can invite the student for the specific event as the teammate and will added as the teammate for the specific event# TalentHunt

**TalentHunt** is a full-stack web platform designed to streamline the process of mentoring and team formation for hackathon participants. Built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), it supports three user roles — **Admin**, **Student**, and **Mentor** — each with unique features. The application ensures secure access using **JWT-based authentication** and **local storage** for session management.

# 🚀 Features

### 🔐 Authentication
- JWT-based login system for Admin, Student, and Mentor.
- Role-based access control with protected routes.

---

### 👩‍🎓 Student Dashboard
- **Domain & Category Based Matchmaking**: Students are shown a list of other students registered under the same domain and category.
- **Team Invitation**: Students can invite others to form a team for a specific event. Teams are event-specific.
- **Mentor Request**: Students can send a request to mentors for guidance.
- **Chat & Feedback System**: Once mentorship is accepted, students can chat with mentors and receive feedback on their progress.



# 👨‍🏫 Mentor Dashboard
- **Mentorship Requests**: Mentors receive requests from students with personalized introductions.
- **Approve Mentorship**: On approval, the mentor is added as the official mentor for the student for that event.
- **Mentee List**: Mentors can view their current mentees.
- **Feedback System**: Mentors can send feedback to mentees, and mentees can respond.

---

### 🛠️ Admin Dashboard
- **Event Analytics**: View the number of registered students per event.
- **Team Formation Overview**: Monitor teams formed, their members, and assigned mentors.
- **Role Management**: Oversee users across all roles.

---

## 🧰 Tech Stack

| Technology | Role |
|------------|------|
| **MongoDB** | Database |
| **Express.js** | Backend Framework |
| **React.js** | Frontend UI |
| **Node.js** | Server Environment |
| **JWT** | Authentication |
| **TailwindCSS + DaisyUI** | UI Components & Styling |

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js and npm
- MongoDB
- Git

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/talenthunt.git
   cd talenthunt
 only their is the same for the mentor aslo once requested for the mentor and mentor accept the request you can have a chat with the mentor regarding the update with the help of the feedback system 
# mentor section : the mentor will be getting the request from the student and their will be a introduction of the student why he want the mentoring and after the mentorship is approved by the it will be added in the mentee of the student and after that the student can have a feedback based on their progress from the mentor and the student can reply to the mentor 
# admin section :
# The Admin as the feature as the to see the number of student register for the event and the team formation who are their mentor  

# video presentation for the website :https://drive.google.com/file/d/1DF1_lgB6ecBWEMXpE9AFawxwWW658Ji_/view?usp=sharing
# ppt presentation for the website : 