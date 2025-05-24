
module.exports.config = {
  name: "كنية",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "ZINO",
  description: "تغيير كنية جميع الأعضاء في المجموعة",
  commandCategory: "خدمات",
  usages: "كنية [الرد بالكنية]",
  cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;
  if (handleReply.author != senderID) return;

  const newNickname = body.trim();
  if (!newNickname) return api.sendMessage("⚠️ | الرجاء إدخال كنية صحيحة", threadID, messageID);

  const threadInfo = await api.getThreadInfo(threadID);
  const participantIDs = threadInfo.participantIDs;

  api.sendMessage("⏳ | جاري تغيير كنية جميع الأعضاء...", threadID, messageID);

  let success = 0;
  let failed = 0;

  for (const userID of participantIDs) {
    try {
      await api.changeNickname(newNickname, threadID, userID);
      success++;
    } catch {
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return api.sendMessage(
    `✅ | تم تغيير الكنية بنجاح!\n\n` +
    `👥 | تم تغيير: ${success} عضو\n` +
    `❌ | فشل في تغيير: ${failed} عضو`,
    threadID, messageID
  );
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  return api.sendMessage(
    "💬 | قم بالرد على هذه الرسالة بالكنية التي تريد تعيينها لجميع الأعضاء",
    threadID,
    (error, info) => {
      if (error) return;
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID
      });
    },
    messageID
  );
};
