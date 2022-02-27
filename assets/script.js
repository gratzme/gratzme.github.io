$(document).ready(function () {
  $("#tagline").tooltip();

  $("#randomizeEmojis").modal("hide");
  const ppEmailRegistered = localStorage.getItem("ppEmailRegistered");
  if (!!ppEmailRegistered) {
    $("#staticBackdrop").modal("hide");
  } else {
    $("#staticBackdrop").modal("show");
  }

  let state = false;
  const animate = () => {
    if (state) {
      $(".slots").removeClass("loop");
      setTimeout(function () {
        $(".slots").addClass("stop");
      }, 1);
    } else {
      $(".slots").removeClass("stop");
      $(".slots").addClass("loop");
    }
    state = !state;
  };

  const getRandomEmoji = () => {
    const isAnimated = $("#animatedEmoji").prop("checked");
    const emojis = isAnimated ? animatedEmojis : standardEmojis;

    const index = Math.floor(Math.random() * emojis.length + 1);
    const emojiUrl = isAnimated ? "emoji-animated" : "emoji-standard";
    return `<img src="assets/${emojiUrl}/${emojis[index - 1]}">`;
  };

  const displayEmoji = (container) => {
    $("#randomizeEmojis .modal-body .slot-main .slot-inner").html("");
    const emojis = [];
    for (let i = 0; i < 20; i++) {
      let emoji = getRandomEmoji();
      while (emojis.includes(emoji)) {
        emoji = getRandomEmoji();
      }
      emojis.push(emoji);

      $("#randomizeEmojis .modal-body .slot-main .slot-inner").append(
        `<div>${emoji}</div>`
      );
    }

    $("#randomizeEmojis").modal("show");
    animate();

    let randomizeEmojis = new Promise((resolve, reject) => {
      setTimeout(() => {
        animate();
        resolve();
      }, 1000);
    });

    randomizeEmojis.then(() => {
      setTimeout(() => {
        $(container).html(emojis[1]);
        $("#randomizeEmojis").modal("hide");
      }, 1250);
    });
  };

  $("#mainBtn").click(() => {
    $("#mainBtn > i").removeClass("d-none");
    displayEmoji(".emoji.mainIdea");
  });

  $("#sentence2Btn").click(() => {
    $("#sentence2Btn > i").removeClass("d-none");
    $("#mainBtn > i").addClass("d-none");
    $("#mainBtn").attr("disabled", "disabled");
    displayEmoji(".emoji.sentence2");
  });

  $("#sentence3Btn").click(() => {
    $("#sentence3Btn > i").removeClass("d-none");
    $("#sentence2Btn > i").addClass("d-none");
    $("#sentence2Btn").attr("disabled", "disabled");
    displayEmoji(".emoji.sentence3");
  });

  $("#sentence4Btn").click(() => {
    $("#sentence4Btn > i").removeClass("d-none");
    $("#sentence3Btn > i").addClass("d-none");
    $("#sentence3Btn").attr("disabled", "disabled");
    displayEmoji(".emoji.sentence4");
  });

  $("#endBtn").click(() => {
    $("#endBtn > i").removeClass("d-none");
    $("#sentence4Btn > i").addClass("d-none");
    $("#sentence4Btn").attr("disabled", "disabled");
    displayEmoji(".emoji.endSentence");
  });

  $("#my-form").submit((e) => {
    e.preventDefault();
    const form = $("#my-form");
    const data = new FormData(form[0]);
    const action = e.target.action;
    $(".modal-body > .form-container .btnSubmit").addClass("d-none");
    $(".modal-body > .form-container .processing").removeClass("d-none");

    fetch(action, {
      method: "POST",
      body: data,
    }).then(() => {
      localStorage.setItem("ppEmailRegistered", true);
      $(".modal-body > .form-container").html(
        "<div class='d-flex align-items-center'><img src='assets/emoji-animated/party_popper.gif' /><div>Thank you for using The Random Emoji Power Paragraph</div></div>"
      );
      setTimeout(() => {
        $("#staticBackdrop").modal("hide");
      }, 3000);
    });
  });

  const generateTimeInfo = () => {
    const dateObj = new Date();
    const remainingTime = parseInt($("#remainingTime").val());
    dateObj.setMinutes(remainingTime / 60);
    dateObj.setSeconds(remainingTime % 60);

    const min = dateObj.getMinutes();
    const sec = dateObj.getSeconds();
    return {
      minutes: {
        firstDigit: parseInt(min / 10),
        lastDigit: parseInt(min % 10),
      },
      seconds: {
        firstDigit: parseInt(sec / 10),
        lastDigit: parseInt(sec % 10),
      },
    };
  };

  const createHandles = (flipElement) => {
    const flipperTop = flipElement.find(".flipper-top");
    const flipperBottom = flipElement.find(".flipper-bottom");
    const flipperDisplayTop = flipElement.find(".flip-display-top");
    const flipperDisplayBottom = flipElement.find(".flip-display-bottom");
    const flipHiddenInput = flipElement.find("[type='hidden']");
    return {
      flipElement,
      flipperTop,
      flipperBottom,
      flipperDisplayBottom,
      flipperDisplayTop,
      flipHiddenInput,
    };
  };

  const setInitialValues = (flipElement, initialValue) => {
    const {
      flipperTop,
      flipperBottom,
      flipperDisplayBottom,
      flipperDisplayTop,
      flipHiddenInput,
    } = flipElement;
    flipperTop.text(initialValue);
    flipperBottom.text(initialValue);
    flipperDisplayBottom.text(initialValue);
    flipperDisplayTop.text(initialValue);
    flipHiddenInput.val(initialValue);
  };

  let minutesFirst;
  let minutesLast;
  let secondsFirst;
  let secondsLast;
  const setInitial = (value = 0) => {
    $(".flip-clock").each(function (_, flipClock) {
      const intialTime = generateTimeInfo();
      minutesFirst = createHandles($(flipClock).find(".minutes-first"));
      minutesLast = createHandles($(flipClock).find(".minutes-last"));
      secondsFirst = createHandles($(flipClock).find(".seconds-first"));
      secondsLast = createHandles($(flipClock).find(".seconds-last"));
      setInitialValues(minutesFirst, intialTime.minutes.firstDigit || value);
      setInitialValues(minutesLast, intialTime.minutes.lastDigit || value);
      setInitialValues(secondsFirst, intialTime.seconds.firstDigit || value);
      setInitialValues(secondsLast, intialTime.seconds.lastDigit || value);
    });
  };

  setInitial(0);

  const startTimer = () => {
    const time = generateTimeInfo();
    flipDigit(secondsLast, time.seconds.lastDigit);
    flipDigit(secondsFirst, time.seconds.firstDigit);
    flipDigit(minutesLast, time.minutes.lastDigit);
    flipDigit(minutesFirst, time.minutes.firstDigit);
    const remaining = parseInt($("#remainingTime").val());
    $("#remainingTime").val(remaining - 1);
    if (remaining < 1) {
      clearInterval(timer);
    }
  };

  let timer;
  const getTimer = () => {
    timer = setInterval(() => {
      const time = generateTimeInfo();
      flipDigit(secondsLast, time.seconds.lastDigit);
      flipDigit(secondsFirst, time.seconds.firstDigit);
      flipDigit(minutesLast, time.minutes.lastDigit);
      flipDigit(minutesFirst, time.minutes.firstDigit);
      const remaining = parseInt($("#remainingTime").val());
      $("#remainingTime").val(remaining - 1);
      if (remaining < 1) {
        clearInterval(timer);
      }
    }, 1000);
  };

  $("#start-timer").click(() => {
    const sessionLength =
      $("#remainingTime").val() / 60 || $("#in-minutes").val();

    if (sessionLength == 0) return;

    $("#remainingTime").val(sessionLength * 60);

    setInitial();
    startTimer();
    getTimer();
  });

  $("#stop-timer").click(() => {
    if ($("#remainingTime").val() > 0) {
      $("#remainingTime").val(parseInt($("#remainingTime").val()) + 1);
    }
    clearInterval(timer);
  });

  $("#clear-timer").click(() => {
    clearInterval(timer);
    $("#in-minutes").val(0);
    $("#remainingTime").val(0);
    setInitial();
  });

  const flipDigit = (flipHandles, digitValue) => {
    const {
      flipElement,
      flipperTop,
      flipperBottom,
      flipperDisplayBottom,
      flipperDisplayTop,
      flipHiddenInput,
    } = flipHandles;

    const setPreviousValue = (value) => {
      flipperTop.text(value);
      flipperDisplayBottom.text(value);
    };
    const setAfterValue = (value) => {
      flipperDisplayTop.text(value);
      flipperBottom.text(value);
    };

    if (parseInt(flipHiddenInput.val()) !== digitValue) {
      setPreviousValue(flipHiddenInput.val());
      flipHiddenInput.val(digitValue).trigger("valueChanged");
    }

    flipHiddenInput.one("valueChanged", () => {
      setAfterValue(flipHiddenInput.val());
      flipElement.addClass("play");
    });

    flipperBottom.one("animationend", () => {
      setAfterValue(flipHiddenInput.val());
      setPreviousValue(flipHiddenInput.val());
      flipElement.removeClass("play");
    });
  };

  $("#minus").click(() => {
    const length = parseInt($("#in-minutes").val());
    console.log("length: ", length);
    if (length > 0) {
      $("#in-minutes").val(length - 1);
    }
  });

  $("#in-minutes").keypress((e) => {
    if ($("#in-minutes").val().length === 2 || e.keyCode === 45) return false;
  });

  $("#plus").click(() => {
    const length = parseInt($("#in-minutes").val());
    if (length < 60) {
      $("#in-minutes").val(length + 1);
    }
  });
});
