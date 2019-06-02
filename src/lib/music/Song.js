'use strict';
const ytdl = require('ytdl-core');
const util = require('../../util/util.js');

/*
An object representing a song.
*/
class Song {
    constructor({ title, url, type, duration = null, stream = null, thumbnail = null }) {
        this.title = title;
        this.url = url;
        this.duration = util.formatTime(duration);
        this.type = type; //youtube, youtubepl, search
        this.stream = stream;
        this.thumbnail = thumbnail;
        this.startTime = null;
    }

    async getStream() {
        if (this.type === 'search') {
            return this.stream;
        }
        if (this.type === 'youtube') {
            this.stream = ytdl(this.url, {
                retries: 7,
                highWaterMark: 32768
            });
            return this.stream;
        }
        if (this.type === 'youtubepl') {
            //Get duration first.
            let info = await ytdl.getInfo(this.url);
            this.duration = util.formatTime(info.length_seconds);
            this.thumbnail = `https://img.youtube.com/vi/${info.video_id}/mqdefault.jpg`;

            this.stream = ytdl.downloadFromInfo(info, {
                retries: 7,
                highWaterMark: 32768
            });
            return this.stream;
        }
    }
}

module.exports = Song;
