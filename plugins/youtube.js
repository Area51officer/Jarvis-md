/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2023 Loki - Xer.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Jarvis - Loki-Xer 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const {
    yts,
    tiny,
    isUrl,
    System,
    GetYta,
    GetYtv,
    config,
    toAudio,
    Ytsearch,
    getBuffer,
    isPrivate,
    AddMp3Meta,
    extractUrlFromMessage,
  } = require('../lib/');


System(
    {
      pattern: 'video',
      fromMe: isPrivate,
      desc: 'YouTube video downloader',
      type: 'download',
    },
    async (message, match) => {
        match = match || message.reply_message.text;
        if (!match) {
          return await message.reply('_Give a YouTube video *Url* or *Query*_');
        } else {
          const matchUrl = extractUrlFromMessage(match);
          if (isUrl(matchUrl)) {
            return await message.send(
              await GetYtv(matchUrl),
              { caption: await tiny('*made with 🤍*'), quoted: message.data },
              'video'
            );
          } else {
            const data = await Ytsearch(match);
            return await message.send(
              await GetYtv(data.url),
              { caption: tiny('*made with 🤍*'), quoted: message.data },
              'video'
            );
          }
        }
    }
  );
  
  System(
    {
      pattern: 'ytv',
      fromMe: isPrivate,
      desc: 'YouTube video downloader',
      type: 'download',
    },
    async (message, match) => {
        match = match || message.reply_message.text;
        if (!match) {
          return await message.reply('_Give a YouTube video *Url* or *Query*_');
        } else {
          const matchUrl = extractUrlFromMessage(match);
          if (isUrl(matchUrl)) {
            return await message.send(
              await GetYtv(matchUrl),
              { caption: await tiny('*made with 🤍*'), quoted: message.data },
              'video'
            );
          } else {
            const data = await Ytsearch(match);
            return await message.send(
              await GetYtv(data.url),
              { caption: tiny('*made with 🤍*'), quoted: message.data },
              'video'
            );
          }
        }
    }
  );
  
  System(
    {
      pattern: 'yta ?(.*)',
      fromMe: isPrivate,
      desc: 'YouTube audio downloader',
      type: 'download',
    },
    async (message, match) => {
        match = match || message.reply_message.text;
        if (!match) {
          return await message.reply('_Give a YouTube video *Url* or *Query*_');
        } else {
          const matchUrl = extractUrlFromMessage(match);
          if (isUrl(matchUrl)) {
            const data = config.AUDIO_DATA.split(';');
            const aud = await AddMp3Meta(await toAudio(await GetYta(matchUrl), 'mp3'), await getBuffer(data[2]), {
              title: data[0],
              body: data[1],
            });
            await message.client.sendMessage(message.from, {
              audio: aud,
              mimetype: 'audio/mpeg',
            });
          } else {
            const link = await Ytsearch(match);
            const data = config.AUDIO_DATA.split(';');
            const aud = await AddMp3Meta(await toAudio(await GetYta(link.url), 'mp3'), await getBuffer(data[2]), {
              title: data[0],
              body: data[1],
            });
            await message.client.sendMessage(message.from, {
              audio: aud,
              mimetype: 'audio/mpeg',
            });
          }
        }
    }
  );
  
  System(
    {
      pattern: 'song ?(.*)',
      fromMe: isPrivate,
      desc: 'YouTube audio downloader',
      type: 'download',
    },
    async (message, match, m) => {
        match = match || message.reply_message.text;
        if (!match) {
          return await message.reply('_Give a YouTube video *Url* or *Query*_');
        } else {
          const matchUrl = extractUrlFromMessage(match);
          if (isUrl(matchUrl)) {
            const data = config.AUDIO_DATA.split(';');
            const aud = await AddMp3Meta(await toAudio(await GetYta(matchUrl), 'mp3'), await getBuffer(data[2]), {
              title: data[0],
              body: data[1],
            });
            await message.client.sendMessage(message.chat, {
              audio: aud,
              mimetype: 'audio/mpeg',
            });
          } else {
            const link = await Ytsearch(match);
            const download = await message.send(`_*downloading ${link.title}*_`);
            const data = config.AUDIO_DATA.split(';');
            const aud = await AddMp3Meta(await toAudio(await GetYta(link.url), 'mp3'), await getBuffer(data[2]), {
              title: data[0],
              body: data[1],
            });
            await message.client.sendMessage(message.chat, {
              audio: aud,
              mimetype: 'audio/mpeg',
            });
            await download.edit(`_*Successfully downloaded ${link.title}*_`);
          }
        }
    }
  );
  
  System({
    pattern: 'play ?(.*)',
    fromMe: isPrivate,
    desc: 'YouTube video player',
    type: 'download',
  }, async (message, match) => {
      if (!match) {
        return await message.reply('_Give a *Query* to play the song or video_');
      } else {
        if (isUrl(match)) {
          return await message.reply("_Only *Query* will work *e.g : heat waves*_");
        } else {
          const yt = await Ytsearch(match);
          await message.client.sendMessage(message.from, {
            text: `*_${yt.title}_*\n\n\n\`\`\`1.⬢\`\`\` *audio*\n\`\`\`2.⬢\`\`\` *video*\n\n_*Send a number as a reply to download*_`,
            contextInfo: {
              externalAdReply: {
                title: yt.author.name,
                body: yt.ago,
                thumbnail: await getBuffer(yt.image),
                mediaType: 1,
                mediaUrl: yt.url,
                sourceUrl: yt.url,
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            }
          });
        }
      }
  });
  
  System({
    on: 'text',
    fromMe: isPrivate,
    dontAddCommandList: true,
  }, async (message) => {
    if (message.isBot) return;
    if (!message.reply_message.fromMe || !message.reply_message.text) return;
    if (!message.body.includes('⬢')) return;
    let match = message.body.replace('⬢', '');
    if (message.body.includes('1')) {
      const ytAudio = await Ytsearch(match);
      const msg = await message.send(`_*Now playing : ${ytAudio.title} 🎶*_`);
      const data = config.AUDIO_DATA.split(';');
      const aud = await AddMp3Meta(
        await toAudio(await GetYta(ytAudio.url), 'mp3'),
        await getBuffer(data[2]),
        {
          title: data[0],
          body: data[1],
        }
      );
      await message.client.sendMessage(message.from, {
        audio: aud,
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: ytAudio.author.name,
            body: ytAudio.ago,
            thumbnail: await getBuffer(ytAudio.image),
            mediaType: 1,
            mediaUrl: ytAudio.url,
            sourceUrl: ytAudio.url,
            showAdAttribution: false,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: msg });
    } else if (message.body.includes('2')) {
      const data = await Ytsearch(match);
      const q = await message.send(`_*Now playing : ${data.title} 🎶*_`);
      await message.send(
        await GetYtv(data.url),
        { caption: `_*${data.title}*_`, quoted: q },
        'video'
      );
    } else {
      return;
    }
  });
  
  System({
       pattern: 'yts ?(.*)',
       fromMe: isPrivate,
       desc: "yt search",
       type: "search",
  }, async (message, match) => {
      if (!match) {
        return await message.reply('_Please provide an *Query*');
      } else {
        if (isUrl(match)) {
          return await message.reply("_Not a *Url* Please provide an *Query*");
        } else {
          const videos = await yts(match);
          const result = videos.all.map(video => `*🏷️ Title :* _*${video.title}*_\n*📁 Duration :* _${video.duration}_\n*🔗 Link :* _${video.url}_`);
          return await message.reply(`\n\n_*Result Of ${match} 🔍*_\n\n`+result.join('\n\n')+"\n\n*🤍 صنع بواسطة لوكي*")
        }
      }
  });
