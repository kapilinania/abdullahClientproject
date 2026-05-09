# Google Sheets Integration Guide

This guide explains how to connect the forms on your website (Registration, Free Trial, and Contact) to a Google Sheet so that submissions are automatically saved.

## 1. Google Sheet Column Structure

Create a new Google Sheet and create three tabs (sheets) at the bottom named:
1. **Registrations**
2. **TrialBookings**
3. **ContactMessages**

Set up the first row (headers) in each sheet as follows:

### Sheet 1: Registrations
`Timestamp` | `student_name` | `parent_name` | `email` | `mobile` | `country` | `age` | `gender` | `course` | `timing` | `timezone` | `experience` | `message` | `whatsapp_optin`

### Sheet 2: TrialBookings
`Timestamp` | `name` | `email` | `phone` | `course` | `date` | `time`

### Sheet 3: ContactMessages
`Timestamp` | `name` | `email` | `subject` | `message`

---

## 2. Google Apps Script Code

1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the editor and paste the following code:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetName = data.sheet; // Target sheet name sent from JS
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({"result": "error", "message": "Sheet not found"})).setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var newRow = [];
    
    // Map incoming data to headers
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      if (header === "Timestamp") {
        newRow.push(new Date());
      } else {
        newRow.push(data[header] || "");
      }
    }
    
    sheet.appendRow(newRow);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "message": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 3. Deployment Process

1. In the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon (Select type) and choose **Web app**.
3. Fill in the details:
   - **Description**: Website Form Handler
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone (This is crucial for the form to work).
4. Click **Deploy**.
5. Copy the **Web app URL** provided (it ends in `/exec`).

---

## 4. Form Connection Process

1. Open the file `assets/js/slider.js`.
2. Locate line 72:
   ```javascript
   const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with the Web app URL you copied in the previous step.
4. Save the file.

Now, when users submit forms on your website, the data will automatically populate in your Google Sheet!
