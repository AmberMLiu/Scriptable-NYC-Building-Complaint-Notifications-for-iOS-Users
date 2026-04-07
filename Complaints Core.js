// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: envelope;
const NOTIFICATION_TITLE = "Complaints Update"
const DEBUG = false

// ----------------------------- //
// -  CONSTANTS (DON'T TOUCH)  - //
// ----------------------------- //

// API
const API_URL = 'https://data.cityofnewyork.us/resource/eabe-havv.json'

// Cache
const fm = FileManager.iCloud()
const cacheDirectory = fm.joinPath(fm.documentsDirectory(), "complaints")

const buildingID = args.shortcutParameter

// ---------- //
// -  CODE  - //
// ---------- //

const cachePath = fm.joinPath(cacheDirectory, buildingID + ".txt")

// Create directory in iCloud folder
if (!fm.isDirectory(cacheDirectory)) {
    fm.createDirectory(cacheDirectory)
}

// Check if cache file exists. If not, initialize by creating the cache file.
if (!fm.fileExists(cachePath)) {
    // -- Initialize script -- //

    // Get complaints
    const requestURL = API_URL + "?bin=" + buildingID
    const complaints = await new Request(requestURL).loadJSON()

    // Save cache
    let cache = ""
    for (let j = 0; j < complaints.length; j++) {
        const complaint = complaints[j]
        cache += complaint["complaint_number"] + ": "
              + complaint["inspection_date"] + "\n"
    }

    fm.writeString(cachePath, cache)
}
else {
    // -- Check for new complaints -- //

    let newComplaintCount = 0
    let updatedCount = 0

    // Get complaints
    const requestURL = API_URL + "?bin=" + buildingID
    const complaints = await new Request(requestURL).loadJSON();

    // Get list old complaints from cache
    const oldCache = fm.readString(cachePath).split("\n")
    const oldComplaints = {}
    for (let j = 0; j < oldCache.length; j++) {
        const [id, date] = oldCache[j].split(": ")
        oldComplaints[id] = date
    }

    let cache = ""
    // Check for new or updated complaints
    for (let j = 0; j < complaints.length; j++) {
        const id = complaints[j]["complaint_number"]
        const date = complaints[j]["inspection_date"]

        if (!oldComplaints.hasOwnProperty(id)) {
            newComplaintCount += 1
        }
        else if (oldComplaints[id] != "" + date) {
            updatedCount += 1
        }
        
        cache += id + ": " + date + "\n"
    }

    // Update cache
    fm.writeString(cachePath, cache)

    let notificationBody = "";
    // Generate notification
    if (newComplaintCount > 0) {
        notificationBody += newComplaintCount.toString()
                         + " new complaint(s) found, "
    }
    if (updatedCount > 0) {
        notificationBody += updatedCount.toString()
                         + " complaint(s) updated, "
    }
    
    if (DEBUG) {
        notification = new Notification();
        notification.title = "[DEBUG] " + NOTIFICATION_TITLE;
        notification.body = "Checking " + buildingID;
        notification.schedule();
    }
    if (notificationBody != "") {
        notification = new Notification()
        notification.title = NOTIFICATION_TITLE
        notification.body =  notificationBody + "at "
                          + complaints[0]["house_number"] + ", "
                          + complaints[0]["house_street"] + "\n"
        
        notification.schedule()
    }
}

Script.setShortcutOutput(buildingID);
Script.complete()