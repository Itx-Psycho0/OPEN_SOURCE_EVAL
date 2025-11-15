# Global Economic Trends Dashboard
---

# 📈 Global Economic Trends Dashboard

A data visualization dashboard built to track and compare macroeconomic indicators (GDP, inflation, and unemployment) across various countries.

## 📖 About The Project

This project was built to solve the challenge of visualizing complex and often siloed macroeconomic data. It provides a clean, interactive interface for users to select countries and specific indicators, rendering comparative charts to show economic trends over time.

The primary data source is the **World Bank Open Data API**2, providing reliable, standardized data from across the globe.

**note and Important instructions :- **
```
 - please go ahead with the installation guidelines and not with the github pages because this is not a static project
    this is a dynamic project and thus go ahead with the  local installation guidelines
 - please terminate the predict_app server or the app server before switching to the other server and vice versa for each server
    to work properly
```

## ✨ Features

- **Dynamic Data Visualization:** Compare trends for key indicators:
    
    - GDP (Gross Domestic Product)
        
    - Inflation (Consumer Price Index)
        
    - Unemployment (% of Total Labor Force)
        
- **Global Comparison:** Select multiple countries to overlay their economic data on a single, interactive chart.
    
- **Interactive Charts:** Powered by Plotly.js for a responsive, detailed, and professional-grade charting experience.
    
- **[Bonus] Predictive Insights:** Utilizes a simple regression model to forecast future GDP trends based on historical data. 3
    

## 🛠️ Tech Stack

This project is built with a modern web stack:

- **Frontend:** **React**
    
- **Backend:** **Python (Flask, Pandas)** 4
    
- **Visualization:** **Plotly.js** 5
    
- **Data API:** **World Bank Open Data API** 6
    

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js & npm:** [Download Here](https://nodejs.org/en/download/)
    
- **Python 3:** [Download Here](https://www.python.org/downloads/)
    
- **Git:** [Download Here](https://www.google.com/search?q=https://git-scm.com/downloads)
    

### Installation

1. **Clone the repo**
    
    Bash
    
    ```
    git clone https://github.com/your-username/global-economic-dashboard.git
    cd global-economic-dashboard
    ```
    
2. **Set up **
    
    Bash
    
    ```
    install the necessary npm packages with npm install
    pip install requirements.txt
    create venv, install packages) and start predict_app.py so you can test the UI
    run app.py and predict_app.py to start the server
    ```
    
4. **Run the application**
        
        Bash
        
        ```
        go live with the live server on vs code or just run the index.html file
        ```
---

## 📊 Data Source

This project relies entirely on the **World Bank Open Data API**. 7 The key indicators used are:

- **GDP:** `NY.GDP.MKTP.CD` (GDP in current US$)
    
- **Inflation:** `FP.CPI.TOTL.ZG` (Inflation, consumer prices, annual %)
    
- **Unemployment:** `SL.UEM.TOTL.ZS` (Unemployment, total, % of total labor force)
    
