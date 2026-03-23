# Smart Autofill Chrome Extension

## 📌 Problem Statement
Filling online forms repeatedly is time-consuming, error-prone, and inefficient, especially when users have to enter the same information (like name, email, ID, college, etc.) across multiple websites. Existing browser autofill solutions are limited to predefined fields and lack flexibility for custom or dynamic form requirements. 

There is a need for a customizable, reusable, and intelligent system that allows users to define their own data templates and automatically fill forms across different websites while handling inconsistencies in field structures. **Smart Autofill** solves this by providing intelligent, dynamic form completion.

## ✨ Features
* **Custom Virtual Profiles**: Create multiple profiles with custom names (e.g., "Personal", "Job Application", "College Enrollment").
* **Duplicate Profiles**: Easily clone existing profiles to make minor modifications without rewriting all your fields.
* **Unlimited Fields**: Add unlimited custom key-value pairs (like `TNSIF UID`, `Full Name`, `USN`) to each form profile.
* **Intelligent DOM Matching**: Automatically queries input attributes (`id`, `name`, `placeholder`, `aria-labels`) and parses surrounding DOM text (like headers and list items) to find complex inputs naturally—even on highly custom platforms like Google Forms.
* **Persistent Browser Storage**: Robustly stores all profile data locally using `chrome.storage.local`.
* **Fast Modern UI**: Built for a seamless, lightweight popup experience.
* **Secure & Private**: It works locally on your browser across different websites without requiring any backend architecture, ensuring you own your data.

## 🛠 Tech Stack Used
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Platform API**: Chrome Extension Manifest V3 API

## 🚀 How to Download and Install (For Users)
You can directly download the packaged version of the extension without needing to build it yourself!

1. Go to the **[Releases](../../releases)** page on this GitHub repository.
2. Download the latest `smart-autofill-extension-v1.0.0.zip` file attached to the release.
3. Extract the downloaded ZIP file to a folder on your computer.
4. Open your Chromium-based browser (Google Chrome, Brave, Edge, etc.) and navigate to `chrome://extensions/`.
5. Enable **"Developer mode"** with the toggle switch in the top right corner.
6. Click the **"Load unpacked"** button in the top left corner.
7. Select the extracted folder containing the extension files.
8. The extension is now successfully installed! Pin it to your browser toolbar for quick access.

## 💻 Installation & Local Usage (For Developers)
If you want to build the extension from source:

### 1. Clone & Build
Ensure you have [Node.js](https://nodejs.org/) installed, then run the following commands in your terminal:
```bash
# Clone the repository
git clone <your-repo-url>
cd smart-autofill-extension

# Install the required dependencies
npm install

# Build the extension for production
npm run build
```
This will compile the React code and generate a `dist/` directory, which is the actual Chrome Extension.

### 2. Load into Chrome
1. Navigate to `chrome://extensions/`
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the generated `dist/` folder.

## 🤝 Ways to Contribute
Contributions are always welcome! Whether it's adding a new feature, fixing a bug, or improving documentation, your help is appreciated.

### How to Contribute:
1. **Fork the repository** on GitHub.
2. **Clone your fork** locally: `git clone https://github.com/your-username/smart-autofill-extension.git`
3. **Create a new branch** for your feature or bug fix: `git checkout -b feature/awesome-new-feature`
4. **Make your changes**. 
   - To test UI changes, run `npm run dev` to start a local Vite server.
   - For changes to `contentScript.js` or `background.js`, you must run `npm run build` and reload the extension in `chrome://extensions/`.
5. **Commit your changes** clearly describing what you've added or fixed.
6. **Push to your fork** and **Submit a Pull Request** to the `main` branch of this repository.

### What you can work on:
- Improving the DOM matching algorithm for better accuracy.
- Adding an import/export functionality for profiles.
- Enhancing the UI with dark mode support or additional animations.
- Reporting or fixing bugs listed in the GitHub Issues tab.
