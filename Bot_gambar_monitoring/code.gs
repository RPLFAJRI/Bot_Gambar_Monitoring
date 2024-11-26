const token = "7411852319:AAH8Bu60SdWp1XLMcT9-BhCYnVSOvXscGeE"; // Token bot Telegram
const fileId = "1h4sQVPBL407q7Fp_wIuZtQW8tzcN-XgqZqG_SxvxXZU"; // ID Google Sheets
const chatId = "6462511853"; // ID Grup Chat

const settings = {
  fileId: fileId,
  sheetName: "todolist",
  rangeSheet: "B3:I57",
  telegramAccessToken: token,
  chatId: chatId,
  imageName: "Report",
};

function main() {
  deleteTriggers();
  checkAndCreateTrigger();

  //scheduleEveryDayJob("pemanggilan");
  scheduleJob("pemanggilan", jobType.AT, 10);
  // scheduleJob("pemanggilan", jobType.EVERY_HOURS, 24); //alternatif
  // pushTelegramMessage(settings);
}

function pemanggilan() {
  checkAndCreateTrigger();
  pushTelegramMessage(settings);
}

//Push
function pushTelegramMessage(setting) {
  const {
    fileId,
    sheetName,
    rangeSheet,
    telegramAccessToken,
    chatId,
    imageName,
  } = setting;

  if (!isAccessFile(fileId)) {
    console.error("Tidak dapat mengakses file");
    return -1;
  }

  const file = SpreadsheetApp.openById(fileId);
  const sheet = file.getSheetByName(sheetName);
  const range = sheet.getRange(rangeSheet);
  const fileBlob = exportRangeToFileBlob(file, range);
  const date = Utilities.formatDate(new Date(), "GMT+7", "dd-MM-yyyy hh:mm:ss");
  const fileName = `${imageName} ${date}.`;
  sendFileToTelegram(telegramAccessToken, fileBlob, fileName, chatId);
}

function checkAndCreateTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let triggerExists = triggers.some(
    (trigger) => trigger.getHandlerFunction() === "pemanggilan"
  );

  if (!triggerExists) {
    scheduleJob("pemanggilan", jobType.AT, 10);
    console.log("Trigger created successfully for pemanggilan at 10 AM.");
  } else {
    console.log("Trigger already exists for pemanggilan at 10 AM.");
  }
}
