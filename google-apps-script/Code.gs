const RESPONSE_SHEET_NAME = "Responses";
const RESPONSE_HEADERS = [
    "Received at",
    "Answer",
    "Mood",
    "Message",
    "Browser timestamp",
    "Page URL"
];

function setup() {
    const sheet = getResponseSheet_();

    if (sheet.getLastRow() === 0) {
        sheet.appendRow(RESPONSE_HEADERS);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, RESPONSE_HEADERS.length).setFontWeight("bold");
        sheet.autoResizeColumns(1, RESPONSE_HEADERS.length);
    }
}

function doGet() {
    return ContentService.createTextOutput("Merey date response collector is online.");
}

function doPost(event) {
    const payload = parsePayload_(event);

    if (payload.answer !== "yes" || !payload.mood) {
        return jsonResponse_({ ok: false, error: "Invalid response" });
    }

    const sheet = getResponseSheet_();
    sheet.appendRow([
        new Date(),
        payload.answer,
        payload.mood,
        payload.message || "",
        payload.sentAt || "",
        payload.pageUrl || ""
    ]);

    return jsonResponse_({ ok: true });
}

function getResponseSheet_() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(RESPONSE_SHEET_NAME);

    if (!sheet) {
        sheet = spreadsheet.insertSheet(RESPONSE_SHEET_NAME);
    }

    return sheet;
}

function parsePayload_(event) {
    const contents = event && event.postData ? event.postData.contents : "";

    try {
        return JSON.parse(contents || "{}");
    } catch (error) {
        return {};
    }
}

function jsonResponse_(data) {
    return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
