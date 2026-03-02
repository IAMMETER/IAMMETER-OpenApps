- [How to Use This App](#how-to-use-this-app)
  - [Step 1 – Open Settings](#step-1--open-settings)
  - [Step 2 – View Real-Time Dashboard](#step-2--view-real-time-dashboard)
- [About This App](#about-this-app)
- [How to Run](#how-to-run)
  - [Option A – Run Directly (No Server Required)](#option-a--run-directly-no-server-required)
  - [Option B – Host on a Web Server](#option-b--host-on-a-web-server)
- [Why Static Apps Are Supported](#why-static-apps-are-supported)



A fully static web application (no backend required) that provides a customizable monitoring dashboard for IAMMETER energy meters.

Users can:

- Customize the **dashboard title**
- Upload and set a custom **dashboard icon**
- Configure the meter IP address
- Adjust the data refresh interval
- Instantly monitor real-time meter readings

This app demonstrates how easily a personalized monitoring interface can be built on top of IAMMETER’s local API.

# How to Use This App

You can try the live demo here:

https://iammeter.github.io/IAMMETER-OpenApps/apps/example/frontend/index.html

------

## Step 1 – Open Settings

![Dashboard Settings](https://iammeterglobal.oss-accelerate.aliyuncs.com/img/image-20260302142504555.png)

1. Click **Settings**
2. Configure the **Dashboard Title** (displayed at the top of the dashboard)
3. Upload a custom **Icon**
   - Recommended: 64×64 px
   - Maximum size: 512 KB
4. Enter the **Meter IP address**
   - The meter must be in the same LAN as your browser
   - The IP must be directly accessible
5. Set the **Refresh Interval**
6. Click **Apply**
7. Click **Start**

------

## Step 2 – View Real-Time Dashboard

The application switches to the dashboard view and begins displaying live data:

![Dashboard View](https://iammeterglobal.oss-accelerate.aliyuncs.com/img/image-20260228155433043.png)

------

# About This App

This lightweight, single-file web application reads real-time data from an IAMMETER energy meter and presents it in an industrial-style digital dashboard.

This project serves as:

- A reference **“Static App” example** for the [IAMMETER Application Center](https://github.com/IAMMETER/IAMMETER-OpenApps)
- A demonstration of how to use the IAMMETER [local API](https://www.iammeter.com/newsshow/blog-fw-features#51-get-apimonitorjson) (`/api/monitorjson`)
- A base template for developers to build and contribute their own IAMMETER-related open-source applications

The design philosophy is simplicity:

- Single HTML file
- Direct HTTP API calls
- No backend infrastructure required
- Fully self-contained

It demonstrates how easy it is to build custom monitoring solutions around IAMMETER devices.

------

# How to Run

## Option A – Run Directly (No Server Required)

Simply open:

index.html

No installation or server setup required.

You can also use the hosted demo:

https://iammeter.github.io/IAMMETER-OpenApps/apps/example/frontend/index.html

Note: The meter IP must be in the same LAN and accessible from your browser.

------

## Option B – Host on a Web Server

You can host this file on:

- Nginx
- Apache
- GitHub Pages
- NAS
- Router web server

Or run locally:

python -m http.server

Then open:

http://localhost:8000

------

# Why Static Apps Are Supported

IAMMETER energy meters enable **CORS by default**.

This allows:

- Direct browser-to-device HTTP API calls
- Direct browser-to-IAMMETER-Cloud calls
- Direct MQTT connections (via WebSocket brokers)

Because of this architecture, many IAMMETER applications can be built entirely as static web apps without requiring a backend server.

This significantly lowers development complexity and enables rapid prototyping.