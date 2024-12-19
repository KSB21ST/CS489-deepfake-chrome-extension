# Realeye: Deepfake Detection Chrome Extension

Realeye is a Chrome extension that enables users to detect AI-generated images (deepfakes) directly within their browser. Follow the steps below to get started and make the most of this tool.

## Installation Guide

1. **Clone the Repository**  
   Open a terminal and clone the GitHub repository to your local machine:
   ```bash
   git clone git@github.com:KSB21ST/CS489-deepfake-chrome-extension.git
   ```

2. **Open Chrome Extensions**  
   Launch Google Chrome and navigate to the Extensions page by typing the following into the address bar:
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode**  
   In the Extensions page, toggle on **Developer Mode** (located in the top-right corner).

4. **Load the Extension**  
   Click on **Load unpacked**, then browse to the folder where you cloned the repository, and select the "CS489-deepfake-chrome-extension" folder.

## Usage Guide

1. **Activate the Extension**  
   After loading, find the Realeye icon in the Chrome toolbar (top-right corner). Click the icon to open the extension interface.

2. **Start Detection**  
   Turn on the detection feature by clicking the **On** button in the Realeye interface.

3. **Detect AI-Generated Images**  
   Hover your mouse cursor over any image you want to analyze. The extension will process the image and notify you whether it is AI-generated or not.

   - **Note**: The model currently takes approximately 5 seconds to process each image.

## Limitations

- **Generative Model Compatibility**: The detection algorithm works well with specific generative models but may not perform accurately with newer models like FLUX. Updates to improve this are planned.
- **Server Availability**: Due to cost constraints, the detection server will remain operational only until **2024-12-31**.

## Future Improvements

- Expanding the model's training dataset to support more diverse generative technologies.
- Transitioning to a client-side detection system to enhance sustainability.

We hope Realeye helps you navigate the digital landscape more securely by identifying deepfake content. Thank you for using our tool!
