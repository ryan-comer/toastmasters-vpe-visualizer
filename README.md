# Toastmasters VPE Visualizer

A comprehensive toolset designed for Toastmasters Vice Presidents of Education (VPE) to easily scrape, manage, and visualize club data. This project helps VPEs track member progress, monitor DCP goals, and identify potential speakers.

## Repository Structure

This repository is divided into two main components:

*   **`extension/`**: A Chrome/Edge browser extension that scrapes data from the Toastmasters International website.
*   **`viewer/`**: A modern Electron desktop application (built with React) to visualize the scraped data.

---

## 1. Chrome Extension (`/extension`)

The browser extension is responsible for extracting data from the Toastmasters International Club Central reports.

### Features
*   **DCP Scraper**: Captures Distinguished Club Program goals, membership base, and current status.
*   **Paths Scraper**: Extracts member progress in Pathways, including specific levels completed.
*   **Speaker History**: Scrapes member speech history and last speech dates.
*   **JSON Export**: Compiles all data into a single JSON file for the viewer.

### Installation
1.  Clone this repository.
2.  Open Chrome or Edge and navigate to `chrome://extensions`.
3.  Enable **"Developer mode"** (toggle in the top right corner).
4.  Click **"Load unpacked"**.
5.  Select the `extension` folder from this repository.

### Usage
1.  Log in to [Toastmasters International](https://www.toastmasters.org/) as a club officer.
2.  Navigate to **Club Central**.
3.  Click on the extension icon in your browser toolbar.
4.  Click **"Scrape & Download Report"**.
5.  A JSON file (e.g., `toastmasters_vpe_report.json`) will be downloaded to your computer.

---

## 2. Viewer Application (`/viewer`)

The Viewer is a desktop application that provides a rich, interactive dashboard for the data exported by the extension.

### Features
*   **Dashboard Overview**: Quick summary of report date and loaded data.
*   **DCP Points Tab**: 
    *   Visual progress bars for Distinguished, Select Distinguished, and President's Distinguished status.
    *   Grouped view of goals by category (Education, Membership, etc.).
*   **Paths in Progress Tab**: 
    *   Visual progress bars for each level (e.g., "3 of 5" speeches completed).
    *   Easy-to-read status indicators.
*   **Speaker Dates Tab**: 
    *   Sortable table of members and their last speech dates.
    *   Handles "Never" spoken and date parsing automatically.
*   **Speaker Candidates Tab**: 
    *   **Smart Recommendations**: Identifies members who haven't spoken in over 28 days.
    *   **Opportunity Highlighting**: Flags members who are 1 speech away from completing a level.
*   **History**: Automatically saves previously loaded reports for quick access.

### Development & Running
Prerequisites: Node.js and npm installed.

1.  Navigate to the viewer directory:
    ```bash
    cd viewer
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the application (Builds React + Launches Electron):
    ```bash
    npm start
    ```

### Tech Stack
*   **Electron**: Desktop runtime.
*   **React**: UI library.
*   **Vite**: Build tool.
*   **Lucide React**: Icon set.

---

## Workflow

1.  Use the **Extension** to download the latest data from Toastmasters International.
2.  Open the **Viewer** application.
3.  Click "Load New Report" and select the downloaded JSON file.
4.  Analyze the data to plan meetings and reach out to members!