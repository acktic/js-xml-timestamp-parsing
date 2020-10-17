String.prototype.zulu = function () {
  var opt = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  var dmz = [];
  var utc = new Date(this);
  dmz.push(this.moment());
  var gmt = utc.toLocaleString("en-US", opt);
  dmz.push(gmt);

  return dmz;
};

String.prototype.moment = function () {
  var age = new Date();
  var utc = new Date(this);
  var dis = age.getTime() - utc.getTime();
  if (dis < 0) dis = -dis;
  var sec = dis / 1000;
  if (sec < 60)
    return parseInt(sec) + " second" + (parseInt(sec) > 1 ? "s" : "");
  var min = sec / 60;
  if (min < 60)
    return parseInt(min) + " minute" + (parseInt(min) > 1 ? "s" : "");
  var h = min / 60;
  if (h < 24) return parseInt(h) + " hour" + (parseInt(h) > 1 ? "s" : "");
  var d = h / 24;
  if (d < 30) return parseInt(d) + " day" + (parseInt(d) > 1 ? "s" : "");
  var m = d / 30;
  if (m < 12) return parseInt(m) + " month" + (parseInt(m) > 1 ? "s" : "");
  var y = m / 121;

  return parseInt(y) + " year" + (parseInt(y) > 1 ? "s" : "");
};

var xmlTimeStampParsing = function (channel, dateTime) {
  var parse = [];
  if (channel == "entry") {
    var re = dateTime.getElementsByTagName("link")[0].getAttribute("href");
    var dst = dateTime
      .getElementsByTagName("updated")[0]
      .childNodes[0].nodeValue.zulu();
    var since = new Date(
      dateTime.getElementsByTagName("updated")[0].childNodes[0].nodeValue
    ).getTime();
    var gen = dateTime
      .getElementsByTagName("updated")[0]
      .childNodes[0].nodeValue.toLocaleString();
    gen = parseInt(
      gen
        .match(/([0-9]+\:[0-9]+\:[0-9]+)/g)
        .toString()
        .replace(/\:/g, "")
    ).toString(36);
    parse.push({
      since: since,
      dst: dst[0],
      gen: gen,
      re: re.trim(),
    });
  } else {
    if (dateTime.getElementsByTagName("datetime").length > 0) {
      var re = dateTime.getElementsByTagName("link")[0].childNodes[0].nodeValue;
      var ts = parseInt(
        dateTime.getElementsByTagName("datetime")[0].childNodes[0].nodeValue
      );
      var ts_ms = ts * 1000;
      var date = new Date(ts_ms);
      var year = date.getFullYear();
      var mon = ("0" + (date.getMonth() + 1)).slice(-2);
      var min = ("0" + date.getMinutes()).slice(-2);
      var sec = ("0" + date.getSeconds()).slice(-2);
      var hour = ("0" + date.getHours()).slice(-2);
      var date = ("0" + date.getDate()).slice(-2);
      var def =
        year + "-" + mon + "-" + date + " " + hour + ":" + min + ":" + sec;
      var dst = def.zulu();
      var since = new Date(
        parseInt(
          dateTime.getElementsByTagName("datetime")[0].childNodes[0].nodeValue
        )
      );
      var gen = parseInt(
        dateTime.getElementsByTagName("datetime")[0].childNodes[0].nodeValue
      ).toString(36);
      parse.push({
        since: since,
        dst: dst[0],
        gen: gen,
        re: re.trim(),
      });
    } else if (dateTime.getElementsByTagName("pubDate").length > 0) {
      var re = dateTime.getElementsByTagName("link")[0].childNodes[0].nodeValue;
      var dst = dateTime
        .getElementsByTagName("pubDate")[0]
        .childNodes[0].nodeValue.zulu();
      var since = new Date(
        dateTime.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue
      );
      var gen = new Date(
        dateTime.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue
      ).toLocaleString();
      gen = parseInt(
        gen
          .match(/([0-9]+\:[0-9]+\:[0-9]+)/g)
          .toString()
          .replace(/\:/g, "")
      ).toString(36);
      parse.push({
        since: since,
        dst: dst[0],
        gen: gen,
        re: re.trim(),
      });
    } else if (dateTime.getElementsByTagName("dc:date").length > 0) {
      var re = dateTime.getElementsByTagName("dc:date")[0].childNodes[0]
        .nodeValue;
      var dst = dateTime
        .getElementsByTagName("dc:date")[0]
        .childNodes[0].nodeValue.zulu();
      var since = new Date(
        dateTime.getElementsByTagName("dc:date")[0].childNodes[0].nodeValue
      );
      var gen = new Date(
        dateTime.getElementsByTagName("dc:date")[0].childNodes[0].nodeValue
      ).getTime();
      gen = gen.toString(36);
      parse.push({
        since: since,
        dst: dst[0],
        gen: gen,
        re: re.trim(),
      });
    } else parse.push("");
  }
  return parse[0];
};
