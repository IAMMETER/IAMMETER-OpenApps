# IAMMETER Industrial Monitor Dashboard

You can have a try by click directly here

https://iammeter.github.io/IAMMETER-OpenApps/apps/example/frontend/index.html



![image-20260228155433043](https://iammeterglobal.oss-accelerate.aliyuncs.com/img/image-20260228155433043.png)



A lightweight, single-file web application that reads real-time data from an IAMMETER energy meter and displays it in an industrial-style digital dashboard.

This project serves as:

- ✅ A **reference example** for the IAMMETER-OpenApps Application Center
- ✅ A demonstration of how to use the IAMMETER local API (`/api/monitorjson`)
- ✅ A base template for developers to build and contribute their own IAMMETER-related open-source applications

------

## 1. Example Application for IAMMETER-OpenApps

This dashboard is intentionally designed as a clean, minimal, and self-contained example:

- Single HTML file (no backend required)
- Clear separation between **Dashboard** and **Settings**
- Uses IAMMETER local HTTP API directly
- Easy to modify and extend

It demonstrates how simple it is to build applications around IAMMETER devices.

We encourage developers to use this as a starting point and submit their own IAMMETER-related open-source tools to the repository.

------

## 2. Real-Time Digital Display of Single-Phase Meter Data

The application periodically polls:

```
http://<meter-ip>/api/monitorjson
```

It parses the returned JSON and displays the following 7 parameters:

- Voltage (V)
- Current (A)
- Power (W)
- Import Energy (kWh)
- Export Energy (kWh)
- Frequency (Hz)
- Power Factor (PF)

The UI follows an industrial monitoring style with large numeric values, suitable for:

- Electrical rooms
- Workshop monitoring
- On-site maintenance
- Wall-mounted dashboards
- Quick visual inspection scenarios

------

## 3. Customizable Refresh Rate, Title and Logo

From the **Settings** page, users can configure:

### Meter Settings

- Meter IP / Host
- Refresh Interval (ms)

### UI Customization

- Custom Dashboard Title
- Custom Logo/Icon

The logo can be:

- A relative image path (when hosted on a server)
- OR automatically converted into a **64×64 base64 image**

When uploading an image:

- It is resized to 64×64
- Compressed (WebP preferred, PNG fallback)
- Optimized for localStorage size
- Fully compatible with offline usage

The logo is displayed on the **left side of the in-page title**, not the browser tab title.

------

## 4. No Server Required

This application is fully frontend-based.

You can run it in two ways:

### Option A – Run Directly from Disk (Offline Mode)

Simply open:

```
index.html
```

No server installation required.

- Base64 logo works perfectly in `file://` mode.
- Ideal for portable or offline usage.

Note:
 Browser security policies may restrict HTTP requests in some environments. For best stability, see Option B.

------

### Option B – Run on a Web Server

You can host the file on:

- Nginx
- Apache
- GitHub Pages
- NAS
- Router Web server
- Or run locally:

```
python -m http.server
```

Then open:

```
http://localhost:8000
```

------

## CORS Requirement

To fetch data directly from the browser, the IAMMETER device must return:

```
Access-Control-Allow-Origin: *
```

If this header is present, the dashboard will work without any proxy or backend service.

------

## Quick Start

1. Download or clone the repository
2. Open `index.html`
3. Go to **Settings**
4. Enter your meter IP
5. Click **Start**

That’s it.

------

## Why This Matters

IAMMETER is not just a hardware energy meter — it is a platform.

This project shows how easily developers can:

- Build monitoring dashboards
- Create custom tools
- Integrate IAMMETER into web systems
- Develop vertical applications

We welcome contributions to make IAMMETER-OpenApps a real **IAMMETER Application Center**.

If you build something useful on top of IAMMETER, please submit a Pull Request.