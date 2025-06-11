# StackBlitz Deployment Guide

## Quick Upload to StackBlitz

### Option 1: Direct Upload (Recommended)

1. **Prepare the frontend folder**:
   - Copy the entire `frontend/` folder contents
   - Use `package-stackblitz.json` instead of `package.json` if you want a cleaner dependency list

2. **Upload to StackBlitz**:
   - Go to [stackblitz.com](https://stackblitz.com)
   - Click "Create Project" → "Import from GitHub" or "Upload Files"
   - Upload your frontend folder contents
   - StackBlitz will automatically detect it as a React project

3. **The app will run automatically** with the mock backend!

### Option 2: GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add StackBlitz support with mock API"
   git push
   ```

2. **Import from GitHub**:
   - Go to StackBlitz
   - Click "Import from GitHub"
   - Enter your repository URL
   - Select the `frontend` folder as the root

### Option 3: Direct StackBlitz URL

You can create a StackBlitz project directly with this URL pattern:
```
https://stackblitz.com/github/YOUR_USERNAME/YOUR_REPO_NAME/tree/main/frontend
```

## What's Included for StackBlitz

✅ **Mock API Service**: Fully functional backend simulation using localStorage
✅ **Auto-detection**: Automatically switches to mock mode when running on StackBlitz
✅ **Sample Data**: Pre-loaded with example quotes for demonstration
✅ **Full Functionality**: All features work including create, read, update operations
✅ **Persistent Storage**: Data persists across browser sessions using localStorage

## Features Available in StackBlitz Demo

- 📝 **Create new insurance quotes** with full form validation
- 📊 **Dashboard view** with all quotes and status management
- 🔄 **Status updates** (approve, reject, pending)
- 💰 **Premium calculation** based on age, coverage, and insurance type
- 📱 **Responsive design** works on all screen sizes
- 🎨 **Material-UI components** for modern, professional appearance

## Troubleshooting

**If the app doesn't start automatically:**
1. Check that `package.json` is in the root of your uploaded files
2. Make sure all dependencies are properly listed
3. Try refreshing the StackBlitz page

**If you see API errors:**
- The app should automatically fall back to mock data
- Check the browser console for any error messages
- Ensure `src/services/mockAPI.ts` and `src/services/apiService.ts` are present

**For the best demo experience:**
- Start by visiting the Dashboard to see sample data
- Try creating a new quote using the Quote Form
- Test status updates by clicking on status badges in the Dashboard

## File Structure for Upload

When uploading to StackBlitz, include these key files:
```
├── package.json (or package-stackblitz.json renamed)
├── tsconfig.json
├── public/
│   ├── index.html
│   └── [other public files]
└── src/
    ├── App.tsx
    ├── index.tsx
    ├── components/
    ├── pages/
    └── services/
        ├── apiService.ts (with StackBlitz detection)
        └── mockAPI.ts (mock backend)
```

The application is fully self-contained and doesn't require any external services when running on StackBlitz!
