# Node.js Express CI/CD DevOps Experiment

A complete, beginner-friendly Node.js Express application integrated with Docker and a declarative Jenkins CI/CD pipeline. Perfect for college DevOps lab experiments.

---

## 📂 Project Structure

```text
nodejs-devops-app/
├── app.js               # Main Express application with interactive UI
├── test.js              # Unit tests using Node.js native test runner
├── package.json         # Dependencies and script definitions
├── Dockerfile           # Docker configuration for image builds
├── .dockerignore        # List of files excluded from Docker builds
├── Jenkinsfile          # 7-stage declarative Jenkins pipeline
└── README.md            # Configuration guide and command instructions (This file)
```

---

## 💻 Local Developer Guide

Follow these commands to test and run the project locally on your machine.

### 1. Installation & Local Run
First, make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

```bash
# Install dependencies
npm install

# Start the Express server locally
npm start

# Run unit tests
npm test
```
*Once started, open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive DevOps dashboard!*

---

## 🐳 Docker Commands

Test containerizing your application locally before pushing to Jenkins.

### 1. Build the Docker Image
Replace `your-docker-username` with your actual Docker Hub username:
```bash
docker build -t your-docker-username/nodejs-devops-app:latest .
```

### 2. Run the Docker Container
```bash
docker run -d -p 3000:3000 --name nodejs-app-container your-docker-username/nodejs-devops-app:latest
```
*Verify by accessing [http://localhost:3000](http://localhost:3000).*

### 3. Stop and Remove the Container
```bash
# Stop the container
docker stop nodejs-app-container

# Delete the container
docker rm nodejs-app-container
```

---

## 🚀 Git Setup & Repository Push

To trigger Jenkins automatically, your code needs to be on GitHub. Run these commands in your project directory:

```bash
# Initialize local Git repository
git init

# Add all files
git add .

# Create your first commit
git commit -m "feat: initial commit for devops project"

# Rename branch to main
git branch -M main

# Link local repository to your remote GitHub repository
# (Replace with your actual GitHub repo URL)
git remote add origin https://github.com/your-github-username/your-repo-name.git

# Push the code to GitHub
git push -u origin main
```

---

## 🛠️ Jenkins Configuration Steps

Follow these exact steps to set up Jenkins for this pipeline.

### Step 1: Install Required Jenkins Plugins
Ensure these plugins are installed in Jenkins:
1. Go to **Dashboard** -> **Manage Jenkins** -> **Plugins** -> **Available Plugins**.
2. Search for and install:
   * **Pipeline**
   * **Git**
   * **Credentials Binding** (used for Docker Hub login)
   * **GitHub Integration Plugin** (for webhooks)

### Step 2: Configure Docker Hub Credentials in Jenkins
To securely push images to Docker Hub:
1. Go to **Dashboard** -> **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials (unrestricted)**.
2. Click **Add Credentials** in the top right.
3. Configure the following:
   * **Kind**: `Username with password`
   * **Scope**: `Global`
   * **Username**: *Your Docker Hub username*
   * **Password**: *Your Docker Hub password (or Access Token)*
   * **ID**: `docker-hub-credentials` *(Must match the ID in the Jenkinsfile)*
   * **Description**: `Docker Hub account credentials`
4. Click **Create**.

### Step 3: Create the Jenkins Pipeline Job
1. From the Jenkins Dashboard, click **New Item**.
2. Enter the name: `nodejs-devops-pipeline`.
3. Select **Pipeline** and click **OK**.
4. In the configuration window:
   * Under **General**, check the box **GitHub project** and enter your repository URL (e.g. `https://github.com/your-github-username/your-repo-name/`).
   * Under **Build Triggers**, check **GitHub hook trigger for GITScm polling** (this enables automatic build on git push).
5. Scroll down to **Pipeline**:
   * **Definition**: Select `Pipeline script from SCM`.
   * **SCM**: Select `Git`.
   * **Repository URL**: Enter your GitHub repository URL (e.g. `https://github.com/your-github-username/your-repo-name.git`).
   * **Credentials**: Add your GitHub credentials if your repo is private; select `- none -` if public.
   * **Branch Specifier**: Change `*/master` to `*/main` (or matching your default branch).
   * **Script Path**: Verify it is set to `Jenkinsfile`.
6. Click **Save**.

### Step 4: Configure GitHub Webhook
To trigger a build automatically every time you push code to GitHub:
1. Go to your repository on **GitHub.com**.
2. Click **Settings** (tab on the top menu) -> **Webhooks** -> **Add webhook**.
3. Configure the webhook:
   * **Payload URL**: Enter `http://YOUR_JENKINS_SERVER_IP:PORT/github-webhook/`  
     *(Example: `http://35.192.4.150:8080/github-webhook/`. Note the trailing slash `/` is critical!)*
   * **Content type**: `application/json`
   * **Secret**: Leave blank.
   * **Which events would you like to trigger this webhook?**: Select **Just the push event**.
   * Check **Active**.
4. Click **Add webhook**.

*Note: If your Jenkins server is running on `localhost` (behind a local network), GitHub cannot reach it directly. You can use a tool like [ngrok](https://ngrok.com/) to expose Jenkins locally:*
```bash
ngrok http 8080
```
*Then, copy the ngrok forwarding URL (e.g., `https://xxxx.ngrok-free.app/github-webhook/`) and paste it as the Payload URL on GitHub.*

---

## 🔍 How to Test the Setup

1. Make a minor text change in `app.js` (for example, edit the title in the header).
2. Commit and push the changes:
   ```bash
   git add .
   git commit -m "fix: update header title"
   git push origin main
   ```
3. Open your Jenkins Dashboard. You will see a new build trigger automatically.
4. Click on the build number and select **Console Output** to monitor the 7 stages as they execute.
5. Once complete, visit `http://YOUR_SERVER_IP:3000` to see your running updated app container.

---

## 💡 Troubleshooting Tips

* **Docker Permission Denied in Jenkins**:  
  If your Jenkins build fails at the Docker build stage with a permission error, it means the `jenkins` user doesn't have permission to use Docker. To fix this on Linux, run:
  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```
* **Port 3000 already in use**:  
  If the last stage fails because port 3000 is occupied, stop any process using that port, or change the port binding in `app.js` and the `Dockerfile`/`Jenkinsfile` commands to another port (e.g., `8080:3000`).
* **Windows Host running Jenkins**:  
  If Jenkins runs on a Windows server, change the `sh` commands inside `Jenkinsfile` to `bat` commands (e.g., `bat 'npm install'`).
