# Personal Expense Tracker 👋
# 📊 Expense Tracker App

A simple personal finance tracker built with **React Native** and **AsyncStorage**.  
This app allows users to record expenses, group them by categories, view totals, and visualize spending patterns.

## 📂 Project Structure

EXPENSETRACKER/
├── app/                 # 📱 Main app screens
│   ├── _layout.js       # Bottom tab navigation
│   ├── index.js         # Home / Overview screen
│   ├── add.js           # Add Expense screen
│   ├── settings.js      # Manage Categories / Settings
│
├── components/          # 🧩 Reusable components
│   ├── ExpenseItem.js
│   ├── ExpenseList.js
│   ├── CategoryPicker.js
│
├── storage/             # 💾 AsyncStorage helpers
│   ├── expenses.js
│   ├── categories.js
│
├── assets/images/       # 🎨 App icons & images
│
├── App.js               # Expo entry file
├── package.json         # Project metadata & dependencies
├── babel.config.js      # Babel config (default)
├── app.json             # Expo app config
├── README.md            # Project documentation
└── .gitignore           # Git ignore rules

## 🚀 Features
- ➕ **Add Expense** with category, amount, and description  
- 📋 **View Expenses List** grouped by date and category  
- 🔍 **Search / Filter** expenses by category or note  
- 🧮 **Totals Updating** (Today, This Week, This Month, Total)  
- 💾 **Data Persistence** using AsyncStorage  
- ⚙️ **Settings Screen** to manage categories & clear all data  
- 📊 **Pie Chart Summary** of expenses (Bonus feature)  

## 🛠️ Setup Instructions
1. Clone this repo:
   ```bash
   git clone https://github.com/KaviyaSureshkumar09/EXPENSETRACKER.git
   cd EXPENSETRACKER
 2. Install dependencies:
 
npm install


3. Start the project:

npx expo start



🎥 Demo Video

👉 Watch the Demo Video

https://drive.google.com/file/d/1F6V5ItwMCrLRe1N31aUpZV_WDtIBhMh5/view?usp=drivesdk
📌 Deliverables

Organized folder structure (app/, components/, storage/)

README.md with setup instructions and feature list

Demo video link included...


