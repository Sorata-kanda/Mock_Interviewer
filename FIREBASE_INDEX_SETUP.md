# Firebase Index Setup Guide

## Issue

When querying Firestore with a filter (`where`) and sorting (`orderBy`) on different fields, Firebase requires a composite index.

## Temporary Fix Applied ✅

I've modified the code to sort results in memory instead of in the database query. This works fine for small datasets but may be slower with many interviews.

## Permanent Solution (Recommended)

### Option 1: Auto-Create Index (Easiest)

1. When you see the error, it includes a link like:
   ```
   https://console.firebase.google.com/v1/r/project/prepwise-4452b/firestore/indexes?create_composite=...
   ```
2. **Click that link** - it will open Firebase Console
3. Click **"Create Index"**
4. Wait 2-5 minutes for the index to build
5. Done! The query will work much faster

### Option 2: Manual Index Creation

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **prepwise-4452b**
3. Go to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"**
5. Configure:
   - **Collection ID**: `interviews`
   - **Fields to index**:
     - Field: `userId`, Order: `Ascending`
     - Field: `createdAt`, Order: `Descending`
   - **Query scope**: `Collection`
6. Click **"Create"**
7. Wait for index to build (shows as "Building..." then "Enabled")

## Why This Happens

Firestore can efficiently query on a single field OR sort on a single field. When you do both on different fields, it needs a special index to maintain performance.

## Current Workaround

The code now:

1. Fetches all interviews for a user (no sorting in query)
2. Sorts them in JavaScript (in memory)
3. Returns sorted results

This works fine for now but creating the index is better for performance as your app grows.

## When to Create the Index

- **Now**: If you want optimal performance
- **Later**: If you're just testing and don't have many interviews yet
- **Before Production**: Definitely create it before deploying to production

---

**Note**: The temporary fix is already applied, so your app works now. Create the index when convenient for better performance! 🚀
