/**
 * Mahmoud & Farah — Nile Invitation
 * Receives guest photo/video uploads from upload.html and saves them
 * into a Google Drive folder named "my engagement", creating that
 * folder the first time it's needed.
 *
 * Setup (see README.md step 4):
 *   1. Go to script.google.com, sign in as the bride (this is whose
 *      Drive the photos will land in).
 *   2. New project → delete the placeholder code → paste this file in.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *   4. Deploy, authorize the Drive permission it asks for, then copy
 *      the Web app URL into upload.html's SCRIPT_URL constant.
 */

var FOLDER_NAME = "my engagement";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "No data received." });
    }

    var data = JSON.parse(e.postData.contents);
    var base64 = data.base64;
    var fileName = (data.fileName || ("upload-" + new Date().getTime())).toString();
    var mimeType = data.mimeType || "application/octet-stream";
    var guestName = (data.guestName || "Guest").toString();

    if (!base64) {
      return jsonResponse({ success: false, error: "No file content received." });
    }

    var folder = getOrCreateFolder(FOLDER_NAME);
    var decoded = Utilities.base64Decode(base64);
    var safeGuestName = guestName.replace(/[\\/:*?"<>|]/g, "").trim() || "Guest";
    var blob = Utilities.newBlob(decoded, mimeType, safeGuestName + " - " + fileName);
    folder.createFile(blob);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  return jsonResponse({ status: "ok", message: "Nile invitation upload endpoint is live." });
}

function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(name);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
