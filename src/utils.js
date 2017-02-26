export const stripTime = (dt) => {
    return dt.substring(0, 10);
};

export const formatDuration = (d) => {
    if (!!d) {
        let hours = Math.floor(d / 3600),
            minutes = Math.floor((d - (hours * 3600)) / 60),
            seconds = d - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return hours + ':' + minutes + ':' + seconds;
    }

    return d;
};