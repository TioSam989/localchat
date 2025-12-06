# LocalChat

A simple, password-protected local chat application that runs on localhost. Perfect for quick team communication on the same network.

## Features

- Password protection (configured via .env)
- Real-time messaging using WebSockets
- Image sharing support
- No data persistence - all messages are cleared when server stops
- Clean, modern UI
- User count display
- Join/leave notifications

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Password**
   - The `.env` file contains the chat password
   - Default password is `minichat`
   - To change it, edit the `.env` file:
     ```
     CHAT_PASSWORD=your_password_here
     PORT=3000
     ```

## Usage

1. **Start the Server**
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. **Access the Chat**
   - Open your browser and go to: `http://localhost:3000`
   - Enter a username (optional - one will be auto-generated if left empty)
   - Enter the password from your `.env` file
   - Start chatting!

3. **Share with Others on Your Network**
   - Find your local IP address:
     - Windows: `ipconfig`
     - Mac/Linux: `ifconfig` or `ip addr`
   - Share the URL: `http://YOUR_LOCAL_IP:3000`
   - Others on the same network can join using this URL

## Sending Images

- Click the camera icon (=÷) next to the message input
- Select an image file (max 5MB)
- The image will be shared with all users
- Click on any image to open it in a new tab

## Important Notes

- **No Data Persistence**: All chat messages and images are stored in memory only. When you stop the server, everything is deleted.
- **Local Network Only**: This is designed for local network use, not for internet deployment.
- **Password Security**: The password is stored in the `.env` file. Keep this file secure and don't commit it to version control.

## Security

- The `.env` file is excluded from git via `.gitignore`
- Images are limited to 5MB to prevent memory issues
- Basic XSS protection is implemented on the client side

## Troubleshooting

**Can't connect to the server:**
- Make sure the server is running
- Check that you're using the correct port (default: 3000)
- Verify your firewall isn't blocking the connection

**Password not working:**
- Check the `.env` file for the correct password
- Restart the server after changing the `.env` file

**Images not sending:**
- Ensure the image is under 5MB
- Check that the file is a valid image format (jpg, png, gif, etc.)

## Tech Stack

- Node.js
- Express
- Socket.io
- Vanilla JavaScript (no frontend framework)
