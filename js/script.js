$(document).ready(() => {
  let current = getCurrentEpisode();
  updateEpisodesBtns(current.season, current.episode);
  updateVideo(current.season, current.episode, current.time || 0);

  $(".seasons .btn-secondary, .episodes .btn-secondary").on(
    "click",
    function () {
      $(this)
        .parent()
        .find(".btn")
        .removeClass("btn-primary")
        .addClass("btn-secondary");
      $(this).removeClass("btn-secondary").addClass("btn-primary");

      let season = $(".seasons .btn-primary").text().trim();
      let episode = $(".episodes .btn-primary").text().trim();

      if ($(this).parent().hasClass("seasons"))
        updateEpisodesBtns(season, episode);

      updateVideo(season, episode, 0);
      saveEpisode(season, episode, 0);
    }
  );

  let updateCurrent = setInterval(() => {
    let season = $(".seasons .btn-primary").text().trim();
    let episode = $(".episodes .btn-primary").text().trim();
    let time = $("video")[0].currentTime;
    saveEpisode(season, episode, time);
  }, 1000);

  $("video").on("canplaythrough", function () {
    let current = getCurrentEpisode();
    if (time != 0) $("video")[0].currentTime = current.time || 0;
  });
});

const countEpisodes = {
  1: 22,
  2: 22,
  3: 20,
  4: 24,
  5: 24,
  6: 24,
  7: 24,
  8: 24,
  9: 24,
};

function updateEpisodesBtns(season, episode = 1) {
  let html = "";
  for (let i = 0; i < countEpisodes[season]; i++) {
    html += `<button class="btn ${
      i + 1 == episode ? "btn-primary" : "btn-secondary"
    }">${i + 1}</button>`;
  }

  $(".episodes").html(html);
}

function updateVideo(season, episode) {
  $("video")
    .attr("src", getSrc(season, episode))
    .attr("poster", getPoster(season, episode));
}

function getSrc(season, episode) {
  if (season < 10) season = "0" + season;
  if (episode < 10) episode = "0" + episode;

  return `https://himym.mp4club.top/How.I.Met.Your.Mother.s${season}e${episode}.HowIMetSerial.ru.mp4`;
}

function getPoster(season, episode) {
  return `https://vashumamu.top/sites/default/files/styles/online/public/episode/how-i-met-your-mother-season-${season}-episode-${episode}.jpg`;
}

function getCurrentEpisode() {
  return {
    season: getCookie("season") || 1,
    episode: getCookie("episode") || 1,
    time: getCookie("time") || 0,
  };
}

function saveEpisode(season, episode, time) {
  setCookie("season", season);
  setCookie("episode", episode);
  setCookie("time", time);
}

function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
  options = {
    path: "/",
    "max-age": 3600 * 365,
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie =
    encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    "max-age": -1,
  });
}
